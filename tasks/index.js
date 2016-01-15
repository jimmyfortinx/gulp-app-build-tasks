var path = require('path');
var gulpNodeBuildTasks = require('gulp-node-build-tasks');

var $ = require('./utils/plugins-loader');

var gulp;
var config;

var scriptsModule = require('./scripts');
var injectModule = require('./inject');
var buildModule = require('./build');

exports.use = function (userGulp) {
    gulp = userGulp;
}

exports.configure = function (userConfig) {
    config = require('./config')(userConfig);

    if(config.server) {
        gulpNodeBuildTasks.configure(config.server);
    }
}

exports.registerTasks = function () {
    if(!gulp) {
        gulp = require('gulp');
    }

    if(!config) {
        config = require('./config')();
    }

    if(config.hasServer) {
        gulpNodeBuildTasks.use(gulp);
        gulpNodeBuildTasks.registerSubTasks();
    }

    scriptsModule.registerTasks(config, gulp);
    injectModule.registerTasks(config, gulp);
    buildModule.registerTasks(config, gulp);
    require('./watch')(config, gulp);
    require('./unit-tests.js')(config, gulp);
    require('./e2e-tests.js')(config, gulp);
}

exports.karma = require('./karma');
exports.protractor = require('./protractor');