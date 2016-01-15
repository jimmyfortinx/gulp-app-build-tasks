'use strict';

var path = require('path');

var browserSync = require('browser-sync');
var webpack = require('webpack-stream');

var $ = require('./utils/plugins-loader');

var wiredep = require('wiredep').stream;
var _ = require('lodash');

var clientTasksRegister = require('./utils/client-tasks-register');
var serverTasksRegister = require('./utils/server-tasks-register');

exports.clientInject = function (config, gulp, callback) {
    function task() {
        var injectStyles = gulp.src([
            path.join(config.paths.src, '/app/**/*.css')
        ], { read: false });

        var injectScripts = gulp.src([
            path.join(config.paths.src, '/app/**/*.module.js'),
            path.join(config.paths.src, '/app/**/*.js'),
            path.join('!' + config.paths.src, '/app/**/*.spec.js'),
            path.join('!' + config.paths.src, '/app/**/*.mock.js'),
            path.join(config.paths.src, '/components/**/*.js'),
            path.join('!' + config.paths.src, '/components/**/*.spec.js'),
            path.join('!' + config.paths.src, '/components/**/*.mock.js')
        ]);

        var injectOptions = {
            ignorePath: [config.paths.src, path.join(config.paths.tmp, '/serve')],
            addRootSlash: false
        };

        var stream = gulp.src(path.join(config.paths.src, '/*.html'))
            .pipe($.inject(injectStyles, injectOptions))
            .pipe($.inject(injectScripts, injectOptions))
            .pipe(wiredep(_.extend({}, config.wiredep)))
            .pipe(gulp.dest(path.join(config.paths.tmp, '/serve')));

        stream.on('end', callback);
    }

    var runSequence = require('run-sequence').use(gulp);

    runSequence(
        clientTasksRegister.getSubTask('scripts'),
        task
    );
}

exports.registerSubTasks = function (config, gulp) {
    var tasks = {
        'inject': 'clientInject',
    };

    clientTasksRegister.registerSubTasks(exports, config, gulp, tasks);
}

exports.registerTasks = function (config, gulp) {
    exports.registerSubTasks(config, gulp);
}