'use strict';

var path = require('path');

var $ = require('./utils/plugins-loader');

var browserSync = require('browser-sync');

var clientTasksRegister = require('./utils/client-tasks-register');
var serverTasksRegister = require('./utils/server-tasks-register');

function isOnlyChange(event) {
    return event.type === 'changed';
}

exports.watch = function(config, gulp, callback) {
    function task() {
        gulp.watch([path.join(config.paths.src, '/*.html'), 'bower.json'], ['inject']);

        gulp.watch(path.join(config.paths.src, '/app/**/*.css'), function(event) {
            if (isOnlyChange(event)) {
                browserSync.reload(event.path);
            } else {
                gulp.start('inject');
            }
        });

        gulp.watch(path.join(config.paths.src, '/app/**/*.js'), function(event) {
            if (isOnlyChange(event)) {
                gulp.start('scripts');
            } else {
                gulp.start('inject');
            }
        });

        gulp.watch(path.join(config.paths.src, '/app/**/*.html'), function(event) {
            browserSync.reload(event.path);
        });

        callback();
    }

    var runSequence = require('run-sequence').use(gulp);

    runSequence(
        clientTasksRegister.getSubTask('inject'),
        task
    );
};

exports.registerSubTasks = function(config, gulp) {
    var tasks = {
        'watch': true
    };

    clientTasksRegister.registerSubTasks(exports, config, gulp, tasks);
};

exports.registerTasks = function(config, gulp) {
    exports.registerSubTasks(config, gulp);
};
