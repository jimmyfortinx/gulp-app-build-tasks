var path = require('path');
var $ = require('./utils/plugins-loader');

function gulpAppBuildTasks (userConfig, gulp) {
    var config = require('./config')(userConfig);

    if(!gulp) {
        gulp = require('gulp');
    }

    require('./scripts')(config, gulp);
    require('./inject')(config, gulp);
    require('./build')(config, gulp);
    require('./watch')(config, gulp);
    require('./unit-tests.js')(config, gulp);
    require('./e2e-tests.js')(config, gulp);
}

gulpAppBuildTasks.karma = require('./karma');
gulpAppBuildTasks.protractor = require('./protractor');

module.exports = gulpAppBuildTasks;