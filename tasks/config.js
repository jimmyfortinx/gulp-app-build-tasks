var path = require('path');

module.exports = function (userConfig) {
    return {
        angular: {
            module: userConfig.angular.module
        },
        /**
         *  The main paths of your project handle these with care
         */
        paths: {
            karmaConf: userConfig.paths.karmaConf,
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
    }
}