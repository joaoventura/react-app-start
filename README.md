# React-app-start

A simple boilerplate for react.js applications.

It uses browserify to bundle the javascript source files, and gulp.js to automate the building process. It also provides ways to listen to changes in files and rebuild the project automatically.



## Instructions

### Install

Install the node modules which are needed for building the project.

* Run `npm install`

### Development

Make sure *gulp* is installed globally, else do `npm install -g gulp`.

* Run `gulp watch`.

Open *dist/index.html* in the browser. Changes in files trigger automatic rebuild of the relevant parts.

### Production

* Run `gulp`.

The build is at *dist/*.



## Architecture

### Files and folders

Include your static assets in `app/assets`, your external libraries in `app/lib` and your source code in `app/src`. Update the html file at `app/index.html` as needed.

### Default gulp task

The default gulp task works in the following way (see gulpfile.js source).

* The `app/index.html` file is copied to `dist/index.html`
* Assets in `app/assets` are copied to `dist/assets`
* Javascript libraries in `app/lib` are bundled to `dist/lib/lib.js`
* Javascript source files in `app/src` are bundled to `dist/lib/main.js` using browserify (uses reactify for converting JSX code to regular js)

Javascript is minimized and uglified using *uglify*.

### Watch gulp task

It is similar to the default task, but listens to changes in files and automatically rebuilds the project and does not uglify the javascript file.

### Create other tasks

You can change the gulpfile.js however you like:

* Watch only for changes in some files (for performance reasons)
* Add/Remove uglification
* Add/Remove other folders
* Change behaviors


## Gulp modules

The gulp task depends on the following modules:

* gulp: The task runner
* gulp-concat: To concatenate files
* browserify: To bundle the javascript source files into one file
* reactify: Necessary if you need to parse JSX files before bundling with browserify

Utility modules:

* vinyl-source-stream: Create input stream for browserify
* gulp-if: Conditionally run a task
* gulp-uglify: Minimize and obfuscate js code
* gulp-streamify: Convert uglify pipe streams to browserify streams

Watch modules:

* gulp-watch: To watch for changes in `app/assets`, `app/lib` and `app/index.html`
* watchify: To watch for changes in browserify
