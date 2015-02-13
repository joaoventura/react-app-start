# React-app-start

A minimalist boilerplate for react.js applications. Uses browserify to bundle the javascript source files, and gulp.js to automate the building process.



## Instructions

### Install

Install the node modules which are needed for building the project.

* Run `npm install`

### Development

Make sure *gulp* is installed globally, else do `npm install -g gulp`.

* Run `gulp`.

Open *dist/index.html* in the browser. For every change you make to your sources, you must run `gulp`. Update the gulp file with *watchify* if you want automatic compilations on each change to the source code.



## Architecture

### Files and folders

Include your static assets in `app/assets`, your external libraries in `app/lib` and your own code in `app/src`. Update the html file at `app/index.html` as needed.

### Default gulp task

The default gulp task works in the following way (see gulpfile.js source).

* The `app/index.html` file is copied to `dist/index.html`
* Assets in `app/assets` are copied to `dist/assets`
* Javascript libraries in `app/lib` are bundled to `dist/lib/lib.js`
* Javascript source files in `app/src` are bundled to `dist/lib/main.js` using browserify (uses reactify for converting JSX code to regular js)

For bundles, you can update the gulpfile to add uglification. As for external libraries, if you just want to copy the libraries in `app/lib` instead of creating a bundle, change the behavior to a copy task in the gulpfile.

### Gulp modules

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
