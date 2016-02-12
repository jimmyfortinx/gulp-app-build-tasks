var path = require('path');
var _ = require('lodash');
var IsThere = require('is-there');
var common = require('gulp-common-build-tasks');

var defaultKarmaConfName = 'karma.conf.js';
var defaultProtractorConfName = 'protractor.conf.js';

module.exports = function(userConfig) {
    var newConfig = {
        /**
         *  The main paths of your project handle these with care
         */
        paths: {
            src: 'src',
            dist: 'dist',
            tmp: '.tmp',
            e2e: 'e2e'
        },

        /**
         *  Wiredep is the lib which inject bower dependencies in your project
         *  Mainly used to inject script tags in the index.html but also used
         *  to inject css preprocessor deps and js files in karma
         */
        wiredep: {
            exclude: [/\/bootstrap\.js$/],
            directory: 'bower_components'
        }
    };

    common.config.apply(newConfig, userConfig);

    if (newConfig.jshint) {
        newConfig.jshint.globals.angular = false;
    }

    configureClientPaths();
    configureServer();
    configureAngular();
    configureKarma();
    configureProtractor();

    function setConfPathIfExists(defaultConfName, newConfigProperty) {
        var confPath = path.join(newConfig.projectDirectory, defaultConfName);
        if (IsThere(confPath)) {
            _.set(newConfig, newConfigProperty, confPath);
        }
    }

    function configureClientPaths() {
        if (IsThere(path.join(newConfig.projectDirectory, 'client'))) {
            newConfig.paths.src = path.join('client', newConfig.paths.src);
            newConfig.paths.dist = path.join(newConfig.paths.dist, 'client');
            newConfig.paths.tmp = path.join(newConfig.paths.tmp, 'client');
            newConfig.paths.e2e = path.join('client', newConfig.paths.e2e);
        }
    }

    function configureServer() {
        if (IsThere(path.join(newConfig.projectDirectory, 'server'))) {
            newConfig.hasServer = true;

            newConfig.server = {
                paths: {
                    src: path.join('server', 'src'),
                    dist: path.join('dist', 'server'),
                    tmp: path.join('.tmp', 'server'),
                    e2e: path.join('server', 'e2e')
                }
            };
        }
    }

    function configureAngular() {
        if (_.has(userConfig, 'angular')) {
            newConfig.angular = {
                module: _.get(userConfig, 'angular.module', null)
            };
        }
    }

    function configureKarma() {
        setConfPathIfExists(defaultKarmaConfName, 'karma.conf');
    }

    function configureProtractor() {
        setConfPathIfExists(defaultProtractorConfName, 'protractor.conf');
    }

    return newConfig;
};
