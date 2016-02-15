'use strict';

var path = require('path');
var common = require('gulp-common-build-tasks');

var $ = require('./utils/plugins-loader');

var browserSync = require('browser-sync');

var tasks = common.tasks();

// Downloads the selenium webdriver
tasks.create('.webdriver-update', function(gulp, config, done) {
    /* jshint camelcase: false */
    $.protractor.webdriver_update(done);
    /* jshint camelcase: true */
});

tasks.create('.webdriver-standalone', function(gulp, config, done) {
    /* jshint camelcase: false */
    $.protractor.webdriver_standalone(done);
    /* jshint camelcase: true */
});

function runProtractor(gulp, config, done) {
    // We leave if no protractor conf file exists
    if (!config.protractor) {
        return;
    }

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

tasks.create('.protractor:src', ['.serve:e2e', '.webdriver-update'], runProtractor);
tasks.create('.protractor:dist', ['.serve:e2e-dist', '.webdriver-update'], runProtractor);
tasks.create('.protractor', ['.protractor:src']);

module.exports = tasks;
