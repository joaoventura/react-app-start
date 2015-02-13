/**
 * This gulpfile handles the automatic build of the application
 * It has two tasks:
 *     watch: builds the project and listens to changes in files
 *     default: builds the project once
 */

var browserify = require('browserify');
var gulp = require('gulp');
var concat = require('gulp-concat');
var gulpif = require('gulp-if');
var streamify = require('gulp-streamify');
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');
var reactify = require('reactify');
var source = require('vinyl-source-stream');
var watchify = require('watchify');



/*
* Copies from 'src' to 'dest'.
* Options:
*     - watch: watch for changes in 'src' files.
*/
var copyTask = function (options) {
    if (options.watch) {
        gulp.src(options.src)
            .pipe(watch(options.src))
            .pipe(gulp.dest(options.dest));
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
    } else {
        gulp.src(options.src)
            .pipe(concat(options.bundle))
            .pipe(gulpif(options.uglify, streamify(uglify())))
            .pipe(gulp.dest(options.dest))
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
    }

    if (options.watch) {
        appBundle = watchify(appBundle);
        appBundle.on('update', rebundle);
    }

    rebundle();
}

/*
* Project-specific build task
* Options:
*     - watch: listen to changes in files
*     - uglify: minimize ang uglify javascript code
*/
var buildTask = function (options) {

    copyTask({
        src: 'app/assets/**',
        dest: 'dist/assets',
        watch: options.watch
    });

    copyTask({
        src: 'app/*.html',
        dest: 'dist',
        watch: options.watch
    });

    bundleTask({
        src: 'app/lib/*.js',
        dest: 'dist/lib',
        bundle: 'lib.js',
        uglify: options.uglify,
        watch: options.watch
    });

    browserifyTask({
        src: 'app/src/main.js',
        dest: 'dist/lib',
        bundle: 'main.js',
        transform: [reactify],  // Handle JSX
        uglify: options.uglify,
        watch: options.watch
    });
}


/*
* Default gulp task
* Builds the project to /dist and minimizes javascript
*/
gulp.task('default', function () {
    buildTask({
        uglify: true,
        watch: false
    });
});

/*
* Development gulp task
* Builds the project to /dist and watches for changes in files
* Rebuilds only the changed parts
*/
gulp.task('watch', function () {
    buildTask({
        uglify: false,
        watch: true
    });
});
