'use strict';

var path = require('path');
var common = require('gulp-common-build-tasks');

var $ = require('./utils/plugins-loader');

var browserSync = require('browser-sync');
var browserSyncSpa = require('browser-sync-spa');

var util = require('util');

var proxyMiddleware = require('http-proxy-middleware');

var tasks = common.tasks();

tasks.import(require('./watch'));

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
    // server.middleware = proxyMiddleware('/users', {
    //     target: 'http://jsonplaceholder.typicode.com',
    //     proxyHost: 'jsonplaceholder.typicode.com'
    // });

    browserSync.instance = browserSync.init({
        startPath: '/',
        server: server,
        browser: browser
    });
}

function browserSyncTask(gulp, config, callback, dependencies, baseDir, browser) {
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

tasks.create('.serve', function(gulp, config, callback) {
    var dependencies = 'app.watch';
    var baseDir = [path.join(config.paths.tmp, '/serve'), config.paths.src];

    browserSyncTask(gulp, config, callback, dependencies, baseDir);
});

tasks.create('.serve:dist', function(gulp, config, callback) {
    var dependencies = 'app.build';
    var baseDir = config.paths.dist;

    browserSyncTask(gulp, config, callback, dependencies, baseDir);
});

tasks.create('.serve:e2e', function(gulp, config, callback) {
    var dependencies = 'app.inject';
    var baseDir = [config.paths.tmp + '/serve', config.paths.src];
    var browser = [];

    browserSyncTask(gulp, config, callback, dependencies, baseDir, browser);
});

tasks.create('.serve:e2e-dist', function(gulp, config, callback) {
    var dependencies = 'app.build';
    var baseDir = config.paths.dist;
    var browser = [];

    browserSyncTask(gulp, config, callback, dependencies, baseDir, browser);
});

module.exports = tasks;
