/**
 * This gulpfile handles the automatic build of the application
 * It has two tasks:
 *     watch: builds the project and listens to changes in files
 *     default: builds the project once
 */

var browserify = require('browserify');
var del = require('del');
var gulp = require('gulp');
var concat = require('gulp-continuous-concat');
var gulpif = require('gulp-if');
var notify = require('gulp-notify');
var streamify = require('gulp-streamify');
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');
var reactify = require('reactify');
var source = require('vinyl-source-stream');
var watchify = require('watchify');



var print = function (message) {
    var date = new Date();
    var time = date.toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");
    console.log('[' + time + '] ' + message);
}

/*
* Copies from 'src' to 'dest'.
* Options:
*     - watch: watch for changes in 'src' files.
*/
var copyTask = function (options) {
    if (options.watch) {
        gulp.src(options.src)
            .pipe(watch(options.src))
            .pipe(gulp.dest(options.dest))
            .pipe(notify(function () {
                print('Detected changes in ' + options.src);
            }));
    } else {
        gulp.src(options.src)
            .pipe(gulp.dest(options.dest));
    }
}

/*
* Bundles 'src' files to 'dest/bundle'.
* Options:
*     - bundle: the bundle name
*     - uglify: minimize ang uglify javascript code
*     - watch: watch for changes in 'src' files.
*/
var bundleTask = function (options) {
    if (options.watch) {
        gulp.src(options.src)
            .pipe(watch(options.src))
            .pipe(concat(options.bundle))
            .pipe(gulpif(options.uglify, streamify(uglify())))
            .pipe(gulp.dest(options.dest))
            .pipe(notify(function () {
                print('Detected changes in ' + options.src);
            }));
    } else {
        gulp.src(options.src)
            .pipe(concat(options.bundle))
            .pipe(gulpif(options.uglify, streamify(uglify())))
            .pipe(gulp.dest(options.dest));
    }
}

/*
* Browserifies 'src' files to 'dest/bundle'.
* Options:
*     - bundle: the bundle name
*     - transform: array of transformations
*     - uglify: minimize ang uglify javascript code
*     - watch: watch for changes in 'src' files.
*/
var browserifyTask = function (options) {

    // browserify src must start with ./
    if (options.src.indexOf('./') !== 0)
        options.src = './' + options.src;

    var appBundle = browserify({
        entries: [options.src],         // Entry point, browserify finds the rest
        transform: options.transform,   // Apply transformations
        debug: true,                    // Gives us source mapping
        cache: {},
        packageCache: {},
        fullPaths: true
    });
    var rebundle = function () {
        appBundle.bundle()
            .pipe(source(options.bundle))
            .pipe(gulpif(options.uglify, streamify(uglify())))
            .pipe(gulp.dest(options.dest))
            .pipe(notify(function () {
                print('Detected changes in ' + options.src);
            }));
    }

    if (options.watch) {
        appBundle = watchify(appBundle);
        appBundle.on('update', rebundle);
    }

    rebundle();
}

/*
* Project generic build task
* Options:
*     - watch: listen to changes in files
*     - uglify: minimize ang uglify javascript code
*/
var buildTask = function (options) {

    copyTask({
        src: 'app/assets/**',
        dest: 'build/assets',
        watch: options.watch
    });

    copyTask({
        src: 'app/*.html',
        dest: 'build/',
        watch: options.watch
    });

    bundleTask({
        src: 'app/lib/*.js',
        dest: 'build/lib',
        bundle: 'lib.js',
        uglify: options.uglify,
        watch: options.watch
    });

    browserifyTask({
        src: 'app/src/main.js',
        dest: 'build/lib',
        bundle: 'main.js',
        transform: [reactify],  // Handle JSX
        uglify: options.uglify,
        watch: options.watch
    });
}


/*
* Development gulp task
* Builds the project to /build while watching for changes in files
*/
gulp.task('watch', function () {
    buildTask({
        uglify: false,
        watch: true
    });
});

/*
* Production gulp task
* Builds the project to /build and minimizes javascript code
*/
gulp.task('build', function () {
    del('./build');
    buildTask({
        uglify: true,
        watch: false
    });
});

/*
* Clean gulp task
* Cleans the project /build directory
*/
gulp.task('clean', function () {
    del('./build');
});
