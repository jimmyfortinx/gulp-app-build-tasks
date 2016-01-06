'use strict';

var path = require('path');

var browserSync = require('browser-sync');
var webpack = require('webpack-stream');

var $ = require('./utils/plugins-loader');

var clientTasksRegister = require('./utils/client-tasks-register');
var serverTasksRegister = require('./utils/server-tasks-register');

exports.clientScripts = function (config, gulp) {
    return gulp.src(path.join(config.paths.src, '/app/**/*.js'))
            .pipe($.eslint())
            .pipe($.eslint.format())
            .pipe(browserSync.reload({ stream: true }))
            .pipe($.size());
}

exports.registerSubTasks = function (config, gulp) {
    var tasks = {
        'scripts': 'clientScripts'
    };

    clientTasksRegister.registerSubTasks(exports, config, gulp, tasks);
}

exports.registerTasks = function (config, gulp) {
    exports.registerSubTasks(config, gulp);

    var tasks = {
        'scripts': [clientTasksRegister.getSubTask('scripts')]
    };

    if(config.hasServer) {
        tasks.scripts.push(serverTasksRegister.getSubTask('scripts'));
    }

    clientTasksRegister.registerTasks(gulp, tasks);
}