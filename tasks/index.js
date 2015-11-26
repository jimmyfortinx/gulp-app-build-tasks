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
    
	gulp.task('test', function () {
		$.util.log('test called - not implemented yet', options);
	});
	
	gulp.task('test:e2e', function () {
		$.util.log('test:e2e called - not implemented yet', options);
	});
    
    // Used by Visual Studio Code to run debugger
    gulp.task('start', ['serve']);
    
	gulp.task('serve', function () {
		$.util.log('serve called - not implemented yet', options);
	});
	
	gulp.task('serve:dist', function () {
		$.util.log('serve:dist called - not implemented yet', options);
	});
}