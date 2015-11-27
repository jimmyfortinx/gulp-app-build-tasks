'use strict';

var path = require('path');

var $ = require('./utils/plugins-loader');

var browserSync = require('browser-sync');
var browserSyncSpa = require('browser-sync-spa');

var util = require('util');

var proxyMiddleware = require('http-proxy-middleware');

browserSync.use(browserSyncSpa({
    selector: '[ng-app]'// Only needed for angular apps
}));

module.exports = function (config, gulp) {
    function browserSyncInit(baseDir, browser) {
        browser = browser === undefined ? 'default' : browser;

        var routes = null;
        if (baseDir === config.paths.src || (util.isArray(baseDir) && baseDir.indexOf(config.paths.src) !== -1)) {
            routes = {
                '/bower_components': 'bower_components'
            };
        }

        var server = {
            baseDir: baseDir,
            routes: routes
        };
        
        /*
        * You can add a proxy to your backend by uncommenting the line below.
        * You just have to configure a context which will we redirected and the target url.
        * Example: $http.get('/users') requests will be automatically proxified.
        *
        * For more details and option, https://github.com/chimurai/http-proxy-middleware/blob/v0.0.5/README.md
        */
        // server.middleware = proxyMiddleware('/users', {target: 'http://jsonplaceholder.typicode.com', proxyHost: 'jsonplaceholder.typicode.com'});
        
        browserSync.instance = browserSync.init({
            startPath: '/',
            server: server,
            browser: browser
        });
    }

    gulp.task('serve', ['watch'], function () {
        browserSyncInit([path.join(config.paths.tmp, '/serve'), config.paths.src]);
    });

    gulp.task('serve:dist', ['build'], function () {
        browserSyncInit(config.paths.dist);
    });

    gulp.task('serve:e2e', ['inject'], function () {
        browserSyncInit([config.paths.tmp + '/serve', config.paths.src], []);
    });

    gulp.task('serve:e2e-dist', ['build'], function () {
        browserSyncInit(config.paths.dist, []);
    });
    
    // Used by Visual Studio Code to run debugger
    gulp.task('start', ['serve']);
}