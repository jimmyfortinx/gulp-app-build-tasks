var path = require('path');

function getParentConfigFile(nodeModulesPath) {
    var configFile = 'config';
    
    if(nodeModulesPath) {
        return path.join(nodeModulesPath, '..', configFile);
    } else {
        return path.join('../../..', configFile);
    }
}

/** 
 *  nodeModulesPath is required only when working with npm link in dev 
 *  environment.
 */
module.exports = function (nodeModulesPath) {
    var parentConfig = require(getParentConfigFile(nodeModulesPath));

    return {
        angular: {
            module: parentConfig.angular.module
        },
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
    }
}