'use strict';

var path = require('path');

var $ = require('./utils/plugins-loader');

var clientTasksRegister = require('./utils/client-tasks-register');
var serverTasksRegister = require('./utils/server-tasks-register');

exports.partials = function (config, gulp) {
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
}

exports.html = function (config, gulp, callback) {
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
            .pipe($.size({ title: path.join(config.paths.dist, '/'), showFiles: true }))

         stream.on('end', callback);
    }

    var runSequence = require('run-sequence').use(gulp);

    var dependencies = [clientTasksRegister.getSubTask('inject')];
    if(config.angular) {
        dependencies.push(clientTasksRegister.getSubTask('build:partials'));
    }

    runSequence(dependencies, task);
}

exports.fonts = function (config, gulp) {
    return gulp.src($.mainBowerFiles())
        .pipe($.filter('**/*.{eot,svg,ttf,woff,woff2}'))
        .pipe($.flatten())
        .pipe(gulp.dest(path.join(config.paths.dist, '/fonts/')));
}

exports.other = function (config, gulp) {
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
}

exports.clean = function (config, gulp) {
    return $.del([path.join(config.paths.dist, '/'), path.join(config.paths.tmp, '/')]);
}

exports.clientBuild = function (config, gulp, callback) {
    var runSequence = require('run-sequence').use(gulp);

    runSequence(
        [
            clientTasksRegister.getSubTask('build:html'),
            clientTasksRegister.getSubTask('build:fonts'),
            clientTasksRegister.getSubTask('build:other')
        ],
        callback
    );
}

exports.registerSubTasks = function (config, gulp) {
    var tasks = {
        'build:partials': 'partials',
        'build:html': 'html',
        'build:fonts': 'fonts',
        'build:other': 'other',
        'build': 'clientBuild',
        'clean': true
    };

    clientTasksRegister.registerSubTasks(exports, config, gulp, tasks);
}

exports.registerTasks = function (config, gulp) {
    exports.registerSubTasks(config, gulp);

    var tasks = {
        'build': [clientTasksRegister.getSubTask('build')],
        'clean': [clientTasksRegister.getSubTask('clean')]
    };

    if(config.hasServer) {
        tasks.build.push(serverTasksRegister.getSubTask('build'));
        tasks.clean.push(serverTasksRegister.getSubTask('clean'));
    }

    clientTasksRegister.registerTasks(gulp, tasks);
}