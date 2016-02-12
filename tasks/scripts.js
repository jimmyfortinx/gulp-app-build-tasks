'use strict';

var path = require('path');
var common = require('gulp-common-build-tasks');

var browserSync = require('browser-sync');
var webpack = require('webpack-stream');

var $ = require('./utils/plugins-loader');

var clientTasksRegister = require('./utils/client-tasks-register');
var serverTasksRegister = require('./utils/server-tasks-register');

exports.reload = function(config, gulp) {
    return gulp.src(path.join(config.paths.src, '/app/**/*.js'))
            .pipe(browserSync.reload({ stream: true }))
            .pipe($.size());
};

exports.clientScripts = function(config, gulp, callback) {
    var runSequence = require('run-sequence').use(gulp);

    var tasks = [];

    if (config.jshintEnabled) {
        tasks.push(clientTasksRegister.getSubTask('scripts:jshint'));
    }

    if (config.jscsEnabled) {
        tasks.push(clientTasksRegister.getSubTask('scripts:jscs'));
    }

    tasks.push(clientTasksRegister.getSubTask('scripts:reload'));

    runSequence(tasks, callback);
};

exports.registerSubTasks = function(config, gulp) {
    var commonTasks = {
        'scripts:jshint': 'jshint',
        'scripts:jscs': 'jscs'
    };

    var tasks = {
        'scripts:reload': 'reload',
        'scripts': 'clientScripts'
    };

    clientTasksRegister.registerSubTasks(common.scripts, config, gulp, commonTasks);
    clientTasksRegister.registerSubTasks(exports, config, gulp, tasks);
};

exports.registerTasks = function(config, gulp) {
    exports.registerSubTasks(config, gulp);
};
