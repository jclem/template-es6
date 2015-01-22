/* jshint node: true */

'use strict';

var browserify = require('gulp-browserify');
var gulp       = require('gulp');
var sass       = require('gulp-sass');
var sync       = require('browser-sync');

require('6to5ify');

gulp.task('build', function build() {
  return gulp.src(['src/markdown-editor.js'])
    .pipe((browserify({ transform: ['6to5ify'] })))
    .pipe(gulp.dest('dist'));
});

gulp.task('build:dummy:scripts', function buildDummyScripts() {
  return gulp.src(['test/dummy/src/javascripts/main.js'])
    .pipe((browserify({ transform: ['6to5ify' ], debug: true })))
    .pipe(gulp.dest('test/dummy/dist/javascripts'));
});

gulp.task('build:dummy:styles', function buildDummyStyles() {
  return gulp.src(['test/dummy/src/styles/main.scss'])
    .pipe(sass())
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
