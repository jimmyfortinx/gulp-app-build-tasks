'use strict';

var path = require('path');
var common = require('gulp-common-build-tasks');

var browserSync = require('browser-sync');

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep').stream;
var _ = require('lodash');

var tasks = common.tasks();

function isCss(taskName) {
    return config => !config.less ? taskName : false;
}

function isLess(taskName) {
    return config => config.less ? taskName : false;
}

tasks.create('.styles:css', function(gulp, config) {
    return gulp.src([
        path.join(config.paths.src, '/app/**/*.css'),
        path.join(config.paths.src, '/components/**/*.css')
    ])
        .pipe(browserSync.reload({ stream: true }));
});

tasks.create('.styles:less', function(gulp, config) {
    var lessOptions = {
        options: [
            'bower_components',
            path.join(config.paths.src, '/app')
        ]
    };

    var injectFiles = gulp.src([
        path.join(config.paths.src, '/app/**/*.less'),
        path.join(config.paths.src, '/components/**/*.less')
    ], { read: false });

    var injectOptions = {
        transform: function(filePath) {
            return '@import "' + filePath + '";';
        },
        starttag: '// injector',
        endtag: '// endinjector',
        addRootSlash: false
    };

    return gulp.src([
        path.join(config.paths.src, '/index.less')
    ])
        .pipe($.inject(injectFiles, injectOptions))
        .pipe(wiredep(_.extend({}, config.wiredep)))
        .pipe($.sourcemaps.init())
        .pipe($.less(lessOptions)).on('error', config.errorHandler('Less'))
        .pipe($.autoprefixer()).on('error', config.errorHandler('Autoprefixer'))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest(path.join(config.paths.tmp, '/serve/')))
        .pipe(browserSync.reload({ stream: true }));
});

tasks.create('.styles', [isCss('.styles:css'), isLess('.styles:less')]);

module.exports = tasks;
