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

### Gulp modules

The gulp task depends on the following modules:

* gulp: The task runner
* browserify: To bundle the javascript source files into one file
* reactify: Necessary if you need to parse JSX files before bundle

Utility modules:

* vinyl-source-stream: Create input stream for browserify
* gulp-uglify: Minimize and obfuscate js code
* gulp-streamify: Convert uglify pipe streams to browserify streams
