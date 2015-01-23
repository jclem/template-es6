/* jshint node: true */

'use strict';

var browserify = require('gulp-browserify');
var gulp       = require('gulp');
var notifier   = require('node-notifier');
var sass       = require('gulp-sass');
var sync       = require('browser-sync');
var util       = require('gulp-util');
var isProd     = process.env.NODE_ENV === 'production';

require('6to5ify');

gulp.task('build', function build() {
  var bify = browserify({ transform: ['6to5ify'] });

  if (!isProd) {
    bify.on('error', handleError);
  }

  throw new Error('Change gulp.src target, then remove me!');
  return gulp.src(['src/main.js'])
    .pipe(bify)
    .pipe(gulp.dest('dist'));
});

gulp.task('build:dummy:scripts', function buildDummyScripts() {
  var bify = browserify({ transform: ['6to5ify' ], debug: true });
  bify.on('error', handleError);

  return gulp.src(['test/dummy/src/javascripts/main.js'])
    .pipe(bify)
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
