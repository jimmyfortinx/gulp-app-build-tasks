'use strict';

var path = require('path');

var $ = require('./utils/plugins-loader');

module.exports = function (config, gulp) {
    var runSequence = require('run-sequence').use(gulp);

    gulp.task('partials', function () {
        var sources = [
            path.join(config.paths.src, '/**/*.html'),
            path.join(config.paths.tmp, '/serve/**/*.html'),
            '!' + path.join(config.paths.src, '/index.html'),
            '!' + path.join(config.paths.tmp, '/serve/index.html'),
        ];

        return gulp.src(sources)
            .pipe($.minifyHtml({
                empty: true,
                spare: true,
                quotes: true
            }))
            .pipe($.angularTemplatecache('templateCacheHtml.js', {
                module: config.angular.module
            }))
            .pipe(gulp.dest(config.paths.tmp + '/partials/'));
    });

    gulp.task('html', ['inject'], function () {
        function task () {
            var partialsInjectFile = gulp.src(path.join(config.paths.tmp, '/partials/templateCacheHtml.js'), { read: false });
            var partialsInjectOptions = {
                starttag: '<!-- inject:partials -->',
                ignorePath: path.join(config.paths.tmp, '/partials'),
                addRootSlash: false
            };

            var htmlFilter = $.filter('*.html', { restore: true });
            var jsFilter = $.filter('**/*.js', { restore: true });
            var cssFilter = $.filter('**/*.css', { restore: true });
            var assets;

            return gulp.src(path.join(config.paths.tmp, '/serve/*.html'))
                .pipe($.inject(partialsInjectFile, partialsInjectOptions))
                .pipe(assets = $.useref.assets())
                .pipe($.rev())
                .pipe(jsFilter)
                .pipe($.sourcemaps.init())
                .pipe($.ngAnnotate())
                .pipe($.uglify({ preserveComments: $.uglifySaveLicense }))
                .pipe($.sourcemaps.write('maps'))
                .pipe(jsFilter.restore)
                .pipe(cssFilter)
                .pipe($.sourcemaps.init())
                .pipe($.minifyCss({ processImport: false }))
                .pipe($.sourcemaps.write('maps'))
                .pipe(cssFilter.restore)
                .pipe(assets.restore())
                .pipe($.useref())
                .pipe($.revReplace())
                .pipe(htmlFilter)
                .pipe($.minifyHtml({
                    empty: true,
                    spare: true,
                    quotes: true,
                    conditionals: true
                }))
                .pipe(htmlFilter.restore)
                .pipe(gulp.dest(path.join(config.paths.dist, '/')))
                .pipe($.size({ title: path.join(config.paths.dist, '/'), showFiles: true }));
        }

        var dependencies = ['inject'];
        if(config.angular) {
            dependencies.push('partials');
        }

        runSequence(dependencies, task);
    });

    // Only applies for fonts from bower dependencies
    // Custom fonts are handled by the "other" task
    gulp.task('fonts', function () {
        return gulp.src($.mainBowerFiles())
            .pipe($.filter('**/*.{eot,svg,ttf,woff,woff2}'))
            .pipe($.flatten())
            .pipe(gulp.dest(path.join(config.paths.dist, '/fonts/')));
    });

    gulp.task('other', function () {
        var fileFilter = $.filter(function (file) {
            return file.stat.isFile();
        });

        var sources = [
            path.join(config.paths.src, '/**/*'),
            // We need to explicit .htaccess since /**/* don't seems to return it
            path.join(config.paths.src, '/**/.htaccess'),
            path.join('!' + config.paths.src, '/**/*.{html,css,js}')
        ];

        return gulp.src(sources)
            .pipe(fileFilter)
            .pipe(gulp.dest(path.join(config.paths.dist, '/')));
    });

    gulp.task('clean', function () {
        return $.del([path.join(config.paths.dist, '/'), path.join(config.paths.tmp, '/')]);
    });

    gulp.task('build', ['html', 'fonts', 'other']);
}