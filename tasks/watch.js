'use strict';

var path = require('path');
var common = require('gulp-common-build-tasks');

var $ = require('./utils/plugins-loader');

var browserSync = require('browser-sync');

var tasks = common.tasks();

tasks.import(require('./build'));

function isOnlyChange(event) {
    return event.type === 'changed';
}

tasks.create('.watch', ['.inject'], function(gulp, config) {
    gulp.watch([path.join(config.paths.src, '/*.html'), 'bower.json'], ['app.inject']);

    gulp.watch([
        path.join(config.paths.src, '/app/**/*.css'),
        path.join(config.paths.src, '/components/**/*.css'),
        path.join(config.paths.src, '/app/**/*.less'),
        path.join(config.paths.src, '/components/**/*.less')
    ], function(event) {
        if (isOnlyChange(event)) {
            gulp.start('app.styles');
        } else {
            gulp.start('app.inject');
        }
    });

    gulp.watch([
        path.join(config.paths.src, '/app/**/*.js'),
        path.join(config.paths.src, '/components/**/*.js')
    ], function(event) {
        if (isOnlyChange(event)) {
            gulp.start('app.scripts');
        } else {
            gulp.start('app.inject');
        }
    });

    gulp.watch([
        path.join(config.paths.src, '/app/**/*.html'),
        path.join(config.paths.src, '/components/**/*.html')
    ], function(event) {
        browserSync.reload(event.path);
    });
});

module.exports = tasks;
