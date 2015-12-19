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
    /**
     * Angular configuration
     */
    if(_.has(userConfig, 'angular')) {
        newConfig.angular = {
            module: _.get(userConfig, 'angular.module', null)
        }
    }

    /**
     * Karma configuration
     */
    setConfPathIfExists(defaultKarmaConfName, 'karma.conf');

    /**
     * Protractor configuration
     */
    setConfPathIfExists(defaultProtractorConfName, 'protractor.conf');

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

    return newConfig;
}