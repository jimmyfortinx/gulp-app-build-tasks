var path = require('path');
var _ = require('lodash');
var IsThere = require("is-there");

var defaultKarmaConfName = "karma.conf.js";
var defaultProtractorConfName = "protractor.conf.js";

module.exports = function (userConfig) {
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

    var projectDirectory = getProjectDirectory();

    configureClientPaths();
    configureServer();
    configureAngular();
    configureKarma();
    configureProtractor();

    function setConfPathIfExists (defaultConfName, newConfigProperty) {
        var confPath = path.join(projectDirectory, defaultConfName);
        if(IsThere(confPath)) {
            _.set(newConfig, newConfigProperty, confPath);
        }
    }

    function getProjectDirectory() {
        // This parameter is useful only when npm link is used
        if(_.has(userConfig, 'projectDirectory')) {
            return userConfig.projectDirectory;
        } else {
            return path.join(__dirname, "..");
        }
    }

    function configureClientPaths () {
        if (IsThere(path.join(projectDirectory, 'client'))) {
            newConfig.paths.src = path.join('client', newConfig.paths.src);
            newConfig.paths.dist = path.join('client', newConfig.paths.dist);
            newConfig.paths.tmp = path.join('client', newConfig.paths.tmp);
            newConfig.paths.e2e = path.join('client', newConfig.paths.e2e);
        }
    }

    function configureServer () {
        if (IsThere(path.join(projectDirectory, 'server'))) {
            newConfig.hasServer = true;

            newConfig.server = {
                paths: {
                    src: path.join('server', 'src'),
                    dist: path.join('server', 'dist'),
                    tmp: path.join('server', '.tmp'),
                    e2e: path.join('server', 'e2e')
                }
            }
        }
    }

    function configureAngular () {
        if(_.has(userConfig, 'angular')) {
            newConfig.angular = {
                module: _.get(userConfig, 'angular.module', null)
            }
        }
    }

    function configureKarma () {
        setConfPathIfExists(defaultKarmaConfName, 'karma.conf');
    }

    function configureProtractor () {
        setConfPathIfExists(defaultProtractorConfName, 'protractor.conf');
    }

    return newConfig;
}