'use strict';

var path = require('path');
var common = require('gulp-common-build-tasks');

var $ = require('./utils/plugins-loader');

var tasks = common.tasks();

tasks.import(require('./inject'));

tasks.create('.build:partials', function(gulp, config) {
    var sources = [
        path.join(config.paths.src, '/**/*.html'),
        path.join(config.paths.tmp, '/serve/**/*.html'),
        '!' + path.join(config.paths.src, '/index.html'),
        '!' + path.join(config.paths.tmp, '/serve/index.html')
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

tasks.create('.build:html', function(gulp, config, callback) {
    function task() {
        var partialsInjectFileSrc = path.join(config.paths.tmp, '/partials/templateCacheHtml.js');
        var partialsInjectFile = gulp.src(partialsInjectFileSrc, { read: false });
        var partialsInjectOptions = {
            starttag: '<!-- inject:partials -->',
            ignorePath: path.join(config.paths.tmp, '/partials'),
            addRootSlash: false
        };

        var htmlFilter = $.filter('*.html', { restore: true });
        var jsFilter = $.filter('**/*.js', { restore: true });
        var cssFilter = $.filter('**/*.css', { restore: true });
        var assets;

        var stream = gulp.src(path.join(config.paths.tmp, '/serve/*.html'))
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
            .pipe($.cleanCss())
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

        stream.on('finish', callback);
    }

    var runSequence = require('run-sequence').use(gulp);

    var dependencies = ['app.inject'];
    if (config.angular) {
        dependencies.push('app.build:partials');
    }

    runSequence(dependencies, task);
});

tasks.create('.build:fonts', function(gulp, config) {
    return gulp.src($.mainBowerFiles())
        .pipe($.filter('**/*.{eot,svg,ttf,woff,woff2}'))
        .pipe($.flatten())
        .pipe(gulp.dest(path.join(config.paths.dist, '/fonts/')));
});

tasks.create('.build:other', function(gulp, config) {
    var fileFilter = $.filter(function(file) {
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

tasks.create('.clean', function(gulp, config) {
    return $.del([path.join(config.paths.dist, '/'), path.join(config.paths.tmp, '/')]);
});

tasks.create('.build', ['.build:html', '.build:fonts', '.build:other']);

module.exports = tasks;
