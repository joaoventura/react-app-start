/**
 * This gulpfile handles the automatic build of the application
 *
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



// Default gulp.js task
gulp.task('default', function () {

    copyTask({
        src: 'app/assets/**',
        dest: 'dist/assets',
        watch: false
    });

    copyTask({
        src: 'app/*.html',
        dest: 'dist',
        watch: false
    });

    bundleTask({
        src: 'app/lib/*.js',
        dest: 'dist/lib',
        bundle: 'lib.js',
        uglify: false,
        watch: false
    });

    browserifyTask({
        src: 'app/src/main.js',
        dest: 'dist/lib',
        bundle: 'main.js',
        transform: [reactify],  // Handle JSX
        uglify: false,
        watch: true
    });
});
