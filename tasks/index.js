var path = require('path');
var $ = require('./utils/plugins-loader');

var gulp;
var config;

exports.use = function (userGulp) {
    gulp = userGulp;
}

exports.configure = function (userConfig) {
    config = require('./config')(userConfig);
}

exports.registerTasks = function () {
    if(!gulp) {
        gulp = require('gulp');
    }

    if(!config) {
        config = require('./config')();
    }

    require('./scripts')(config, gulp);
    require('./inject')(config, gulp);
    require('./build')(config, gulp);
    require('./watch')(config, gulp);
    require('./unit-tests.js')(config, gulp);
    require('./e2e-tests.js')(config, gulp);
}

exports.karma = require('./karma');
exports.protractor = require('./protractor');