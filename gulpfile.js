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
var reactify = require('reactify');
var source = require('vinyl-source-stream');



var copyTask = function (options) {
    gulp.src(options.src)
        .pipe(gulp.dest(options.dest));
}

var bundleTask = function (options) {
    gulp.src(options.src)
        .pipe(concat(options.bundle))
        .pipe(gulpif(options.uglify, streamify(uglify())))
        .pipe(gulp.dest(options.dest))
}

var browserifyTask = function (options) {
    var appBundle = browserify({
        entries: [options.src],         // Entry point, browserify finds the rest
        transform: options.transform,   // Apply transformations
        debug: true,                    // Gives us source mapping
    });
    appBundle.bundle()
        .pipe(source(options.bundle))
        .pipe(gulpif(options.uglify, streamify(uglify())))
        .pipe(gulp.dest(options.dest))
}



// Default gulp.js task
gulp.task('default', function () {

    copyTask({
        src: './app/assets/**',
        dest: './dist/assets'
    });

    copyTask({
        src: './app/*.html',
        dest: './dist'
    });

    bundleTask({
        src: './app/lib/*.js',
        dest: './dist/lib',
        bundle: 'lib.js',
        uglify: false
    });

    browserifyTask({
        src: './app/src/main.js',
        dest: './dist/lib',
        bundle: 'main.js',
        uglify: false,
        transform: [reactify]  // Handle JSX
    });

});
