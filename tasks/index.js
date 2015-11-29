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
    
	gulp.task('test:e2e', function () {
		$.util.log('test:e2e called - not implemented yet');
	});
}

gulpAppBuildTasks.karma = require('./karma');

module.exports = gulpAppBuildTasks;