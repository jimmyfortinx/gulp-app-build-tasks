'use strict';

var path = require('path');
var common = require('gulp-common-build-tasks');

var browserSync = require('browser-sync');
var webpack = require('webpack-stream');

var $ = require('./utils/plugins-loader');

var tasks = common.tasks();

tasks.import(common.commonScripts);

tasks.create('.reload', function(gulp, config) {
    return gulp.src([
        path.join(config.paths.src, '/app/**/*.js'),
        path.join(config.paths.src, '/components/**/*.js')
    ])
            .pipe(browserSync.reload({ stream: true }))
            .pipe($.size());
});

tasks.create('.scripts', ['.lint', '.reload']);

module.exports = tasks;
