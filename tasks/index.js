var path = require('path');
var $ = require('./utils/plugins-loader');

module.exports = function (options, gulp) {
    if(!gulp) {
        gulp = require('gulp');
    }
    
    var config = {
        angular: {
            module: options.angular.module
        },
        paths: {
            src: 'src',
            tmp: '.tmp',
            dist: 'dist'
        }
    };

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