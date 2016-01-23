'use strict';

var path = require('path');

var $ = require('./utils/plugins-loader');

var browserSync = require('browser-sync');
var browserSyncSpa = require('browser-sync-spa');

var util = require('util');

var proxyMiddleware = require('http-proxy-middleware');

var clientTasksRegister = require('./utils/client-tasks-register');
var serverTasksRegister = require('./utils/server-tasks-register');

function browserSyncInit(config, baseDir, browser) {
    browser = browser === undefined ? 'default' : browser;

    var routes = null;
    if (baseDir === config.paths.src || (util.isArray(baseDir) && baseDir.indexOf(config.paths.src) !== -1)) {
        routes = {
            '/bower_components': 'bower_components'
        };
    }

    var server = {
        baseDir: baseDir,
        routes: routes
    };

    /*
    * You can add a proxy to your backend by uncommenting the line below.
    * You just have to configure a context which will we redirected and the target url.
    * Example: $http.get('/users') requests will be automatically proxified.
    *
    * For more details and option, https://github.com/chimurai/http-proxy-middleware/blob/v0.0.5/README.md
    */
    // server.middleware = proxyMiddleware('/users', {target: 'http://jsonplaceholder.typicode.com', proxyHost: 'jsonplaceholder.typicode.com'});

    console.log("browserSync", server, browser);

    browserSync.instance = browserSync.init({
        startPath: '/',
        server: server,
        browser: browser
    });
}

function browserSyncTask(config, gulp, callback, dependencies, baseDir, browser) {
    function task() {
        browserSyncInit(config, baseDir, browser);

        callback();
    }

    var runSequence = require('run-sequence').use(gulp);

    runSequence(
        dependencies,
        task
    );
}

exports.serve = function (config, gulp, callback) {
    var dependencies = clientTasksRegister.getSubTask("watch");
    var baseDir = [path.join(config.paths.tmp, '/serve'), config.paths.src];

    browserSyncTask(config, gulp, callback, dependencies, baseDir);
}

exports.serveDist = function (config, gulp, callback) {
    var dependencies = clientTasksRegister.getSubTask("build");
    var baseDir = config.paths.dist;

    browserSyncTask(config, gulp, callback, dependencies, baseDir);
}

exports.serveE2E = function (config, gulp, callback) {
    var dependencies = clientTasksRegister.getSubTask("inject");
    var baseDir = [config.paths.tmp + '/serve', config.paths.src];
    var browser = [];

    browserSyncTask(config, gulp, callback, dependencies, baseDir, browser);
}

exports.serveE2EDist = function (config, gulp, callback) {
    var dependencies = clientTasksRegister.getSubTask("build");
    var baseDir = config.paths.dist;
    var browser = [];

    browserSyncTask(config, gulp, callback, dependencies, baseDir, browser);
}

exports.registerSubTasks = function (config, gulp) {
    if(config.angular) {
        browserSync.use(browserSyncSpa({
            selector: '[ng-app]'// Only needed for angular apps
        }));
    }

    var tasks = {
        'serve': true,
        'serve:dist': 'serveDist',
        'serve:e2e': 'serveE2E',
        'serve:e2e-dist': 'serveE2EDist'
    };

    clientTasksRegister.registerSubTasks(exports, config, gulp, tasks);
}

exports.registerTasks = function (config, gulp) {
    exports.registerSubTasks(config, gulp);

    var tasks = {
        'serve': [clientTasksRegister.getSubTask('serve')],
        'serve:dist': [clientTasksRegister.getSubTask('serve:dist')],
        'serve:e2e': [clientTasksRegister.getSubTask('serve:e2e')],
        'serve:e2e-dist': [clientTasksRegister.getSubTask('serve:e2e-dist')],
        // Used by Visual Studio Code to run debugger
        'start': 'serve'
    };

    if(config.hasServer) {
        tasks['serve'].push(serverTasksRegister.getSubTask('serve'));
        tasks['serve:dist'].push(serverTasksRegister.getSubTask('serve:dist'));
    }

    clientTasksRegister.registerTasks(gulp, tasks);
}