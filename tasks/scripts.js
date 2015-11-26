'use strict';

var path = require('path');

var browserSync = require('browser-sync');
var webpack = require('webpack-stream');

var $ = require('./utils/plugins-loader');

module.exports = function (config, gulp) {
    gulp.task('scripts', function () {
        return gulp.src(path.join(config.paths.src, '/app/**/*.js'))
            .pipe($.eslint())
            .pipe($.eslint.format())
            .pipe(browserSync.reload({ stream: true }))
            .pipe($.size())
    });
}