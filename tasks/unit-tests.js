'use strict';

var path = require('path');

var karma = require('karma');

function isOnlyChange(event) {
    return event.type === 'changed';
}

module.exports = function(config, gulp) {
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

    function runTests(singleRun, done) {
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

    gulp.task('test', ['scripts'], function(done) {
        runTests(true, done);
    });

    gulp.task('test:auto', ['watch'], function(done) {
        runTests(false, done);
    });
};
