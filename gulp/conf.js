//**********************************
// build configuration
//**********************************

/**
 *  This file contains the variables used in other gulp files
 *  which defines tasks
 *  By design, we only put there very generic config values
 *  which are used in several places to keep good readability
 *  of the tasks
 */

var gutil = require('gulp-util');
var pkg = require("../package.json");

exports.server={
    port: 9000
}
exports.pkg = pkg;
exports.module='smart_container';
exports.buildName='LEAW';

/**
 *  The main paths of your project handle these with care
 */
exports.paths = {
  src: 'src',
  lint: 'lint',
  build: 'build',
  dist: 'dist',
  tmp: 'tmp',
  e2e: 'e2e'
};

exports.wiredepOptions = {
    directory: 'bower_components'
};

/**
 *  Common implementation for an error handler of a Gulp plugin
 */
exports.errorHandler = function(title) {
  'use strict';

  return function(err) {
    gutil.log(gutil.colors.red('[' + title + ']'), err.toString());
    this.emit('end');
  };
};




//TODO remove

/*
exports.styles={
    vendor: '/app/vendor.less',
    app: '/app/app.less'
};
*/

/**
 *  Wiredep is the lib which inject bower dependencies in your project
 *  Mainly used to inject script tags in the index.html but also used
 *  to inject css preprocessor deps and js files in karma
 */
/*
exports.wiredep = {
  exclude: [/\/bootstrap\.js$/, /\/bootstrap\.css/],
  directory: 'bower_components'
};
*/

