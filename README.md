# React-app-start

A simple boilerplate for react.js applications.

It uses browserify to bundle the javascript source files, and gulp.js to automate the building process. It also provides ways to listen to changes in files and rebuild the project automatically.



## Instructions

### Install and development

* Run `npm install` to install the necessary *node.js* modules
* Run `npm install -g gulp` to install *gulp* globally
* Run `gulp watch` and start developing
* Open `build/index.html` to display the app.

With `gulp watch`, changes in files trigger the rebuild of the relevant parts.

### Deployment

* Run `gulp build`.

Find you build at `build/`.



## Architecture

### Files and folders

* **app/assets/**: Static files (css, images, fonts, etc.)
* **app/lib/**: External javascript libraries
* **app/src/**: Application source code
* **app/index.html**: Application launcher
* **gulpfile.js**: Task configuration

### Task configuration

This project includes two tasks which work quite similarly.

* The `app/index.html` file is copied to `build/index.html`
* Assets in `app/assets` are copied to `build/assets`
* Javascript libraries in `app/lib` are bundled to `build/lib/lib.js`
* Javascript source files in `app/src` are bundled to `build/lib/main.js` using browserify (uses reactify for converting JSX code to regular js)

The **watch** task listens to changes in files and automatically rebuilds the project as needed. It does not minimize the code. The **build** task minimizes and uglifies the javascript code.


## Gulp modules

The gulp task uses the following modules:

* **gulp**: The task runner
* **gulp-concat**: To concatenate files
* **browserify**: To bundle the javascript source files into one file
* **reactify**: Necessary if you need to parse JSX files before bundling with browserify
* **vinyl-source-stream**: Create input stream for browserify
* **gulp-if**: Conditionally run a task
* **gulp-notify**: Gulp notifications
* **gulp-uglify**: Minimize and obfuscate js code
* **gulp-streamify**: Convert uglify pipe streams to browserify streams
* **gulp-watch**: To watch for changes in `app/assets`, `app/lib` and `app/index.html`
* **watchify**: To watch for changes in browserify
