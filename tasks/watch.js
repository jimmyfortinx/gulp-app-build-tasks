'use strict';

var path = require('path');

var $ = require('./utils/plugins-loader');

var browserSync = require('browser-sync');

function isOnlyChange(event) {
    return event.type === 'changed';
}

module.exports = function (config, gulp) {
    gulp.task('watch', ['inject'], function () {
        gulp.watch([path.join(config.paths.src, '/*.html'), 'bower.json'], ['inject']);

        gulp.watch(path.join(config.paths.src, '/app/**/*.css'), function (event) {
            if (isOnlyChange(event)) {
                browserSync.reload(event.path);
            } else {
                gulp.start('inject');
            }
        });

        gulp.watch(path.join(config.paths.src, '/app/**/*.js'), function (event) {
            if (isOnlyChange(event)) {
                gulp.start('scripts');
            } else {
                gulp.start('inject');
            }
        });

        gulp.watch(path.join(config.paths.src, '/app/**/*.html'), function (event) {
            browserSync.reload(event.path);
        });
    });
    
    require('./server')(config, gulp);
}