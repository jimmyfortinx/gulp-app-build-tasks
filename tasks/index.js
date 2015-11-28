var path = require('path');
var $ = require('./utils/plugins-loader');

module.exports = function (nodeModulesPath, gulp) {
    var config = require('./config')(nodeModulesPath);
    
    if(!gulp) {
        gulp = require('gulp');
    }

    require('./scripts')(config, gulp);
    require('./inject')(config, gulp);
    require('./build')(config, gulp);
    require('./watch')(config, gulp);
    
	gulp.task('test', function () {
		$.util.log('test called - not implemented yet', options);
	});
	
	gulp.task('test:e2e', function () {
		$.util.log('test:e2e called - not implemented yet', options);
	});
}