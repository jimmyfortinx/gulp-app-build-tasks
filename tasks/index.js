var path = require('path');
var $ = require('./utils/plugins-loader');

module.exports = function (options, gulp) {
    if(!gulp) {
        gulp = require('gulp');
    }
    
    var config = {
        paths: {
            src: 'src',
            tmp: '.tmp',
            dist: 'dist'
        }
    };

    require('./scripts')(config, gulp);
    require('./inject')(config, gulp);
    
	gulp.task('test', function () {
		$.util.log('test called - not implemented yet', options);
	});
	
	gulp.task('test:e2e', function () {
		$.util.log('test:e2e called - not implemented yet', options);
	});
	
	gulp.task('serve', function () {
		$.util.log('serve called - not implemented yet', options);
	});
	
	gulp.task('serve:dist', function () {
		$.util.log('serve:dist called - not implemented yet', options);
	});
	
	gulp.task('build', ['scripts'], function () {
        $.util.log('build called - not fully implemented yet', options);
    });
}