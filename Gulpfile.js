/* jshint node: true */

'use strict';

var browserify = require('browserify');
var buffer     = require('vinyl-buffer');
var gulp       = require('gulp');
var notifier   = require('node-notifier');
var sass       = require('gulp-sass');
var source     = require('vinyl-source-stream');
var sync       = require('browser-sync');
var util       = require('gulp-util');
var isProd     = process.env.NODE_ENV === 'production';

require('6to5ify');

gulp.task('build', function build() {
  var bundler = browserify({
    entries  : ['./src/main.js'],
    transform: ['6to5ify']
  });

  var bundle = bundler.bundle();
  if (!isProd) {
    bundle.on('error', handleError);
  }

  return bundle
    .pipe(source('main.js'))
    .pipe(buffer())
    .pipe(gulp.dest('dist'));
});

gulp.task('build:dummy:scripts', function buildDummyScripts() {
  var bundler = browserify({
    debug    : true,
    entries  : ['./test/dummy/src/javascripts/main.js'],
    transform: ['6to5ify']
  });

  var bundle = bundler.bundle();
  bundle.on('error', handleError);
  return bundle
    .pipe(source('main.js'))
    .pipe(buffer())
    .pipe(gulp.dest('test/dummy/dist/javascripts'));
});

gulp.task('build:dummy:styles', function buildDummyStyles() {
  return gulp.src(['test/dummy/src/styles/main.scss'])
    .pipe(sass({ onError: handleError }))
    .pipe(gulp.dest('test/dummy/dist/styles'));
});

gulp.task('dev', function watch() {
  sync({
    server: { baseDir: './test/dummy/dist' },
    open  : false
  });

  gulp.watch(['src/**/*'], ['build']);
  gulp.watch(['src/**/*', 'test/dummy/src/javascripts/**/*'],
             ['build:dummy:scripts']);
  gulp.watch(['test/dummy/src/styles/**/*'], ['build:dummy:styles']);
  gulp.watch(['test/dummy/dist/**/*'], sync.reload);
});

function handleError(e) {
  notifier.notify({ message: 'Error: ' + e.message });
  util.log(util.colors.red('Error'), e.message);
}
