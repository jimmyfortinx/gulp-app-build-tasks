'use strict';

var path = require('path');
var common = require('gulp-common-build-tasks');

var karma = require('karma');

var tasks = common.tasks();

function isOnlyChange(event) {
    return event.type === 'changed';
}

function runTests(gulp, config, singleRun, done) {
    // We leave if no karma conf file exists
    if (!config.karma) {
        return;
    }

    var pathSrcHtml = [
        path.join(config.paths.src, '/**/*.html')
    ];

    var pathSrcJs = [
        path.join(config.paths.src, '/**/!(*.spec).js')
    ];

    var reporters = ['progress'];
    var preprocessors = {};

    pathSrcHtml.forEach(function(path) {
        preprocessors[path] = ['ng-html2js'];
    });

    if (singleRun) {
        pathSrcJs.forEach(function(path) {
            preprocessors[path] = ['coverage'];
        });
        reporters.push('coverage');
    }

    var localConfig = {
        configFile: config.karma.conf,
        singleRun: singleRun,
        autoWatch: !singleRun,
        reporters: reporters,
        preprocessors: preprocessors
    };

    var server = new karma.Server(localConfig, function(failCount) {
        done(failCount ? new Error('Failed ' + failCount + ' tests.') : null);
    });
    server.start();
}

tasks.create('.test', function(gulp, config, done) {
    runTests(gulp, config, true, done);
});

tasks.create('.test:auto', function(gulp, config, done) {
    runTests(gulp, config, false, done);
});

module.exports = tasks;
