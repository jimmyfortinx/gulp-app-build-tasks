'use strict';

var path = require('path');

var $ = require('./utils/plugins-loader');

var browserSync = require('browser-sync');

module.exports = function(config, gulp) {
    // We leave if no protractor conf file exists
    if (!config.protractor) {
        return;
    }

    // Downloads the selenium webdriver
    /* jshint camelcase: false */
    gulp.task('webdriver-update', $.protractor.webdriver_update);
    gulp.task('webdriver-standalone', $.protractor.webdriver_standalone);
    /* jshint camelcase: true */

    function runProtractor(done) {
        var params = process.argv;
        var args = params.length > 3 ? [params[3], params[4]] : [];

        gulp.src(path.join(config.paths.e2e, '/**/*.js'))
            .pipe($.protractor.protractor({
                configFile: config.protractor.conf,
                args: args
            }))
            .on('error', function(err) {
                // Make sure failed tests cause gulp to exit non-zero
                throw err;
            })
            .on('end', function() {
                // Close browser sync server
                browserSync.exit();
                done();
            });
    }

    gulp.task('protractor', ['protractor:src']);
    gulp.task('protractor:src', ['serve:e2e', 'webdriver-update'], runProtractor);
    gulp.task('protractor:dist', ['serve:e2e-dist', 'webdriver-update'], runProtractor);
};
