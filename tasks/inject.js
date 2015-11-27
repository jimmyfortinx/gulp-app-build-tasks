'use strict';

var path = require('path');

var browserSync = require('browser-sync');
var webpack = require('webpack-stream');

var $ = require('./utils/plugins-loader');

var wiredep = require('wiredep').stream;
var _ = require('lodash');

module.exports = function (config, gulp) {
    gulp.task('inject', ['scripts'], function () {
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
    
        return gulp.src(path.join(config.paths.src, '/*.html'))
            .pipe($.inject(injectStyles, injectOptions))
            .pipe($.inject(injectScripts, injectOptions))
            .pipe(wiredep(_.extend({}, config.wiredep)))
            .pipe(gulp.dest(path.join(config.paths.tmp, '/serve')));
    });
}