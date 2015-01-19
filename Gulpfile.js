/* jshint node: true */

'use strict';

var browserify = require('gulp-browserify');
var gulp       = require('gulp');
var sync       = require('browser-sync');

require('6to5ify');

gulp.task('build', function build() {
  return gulp.src(['src/markdown-editor.js'])
    .pipe((browserify({ transform: ['6to5ify' ]})))
    .pipe(gulp.dest('dist'));
});

gulp.task('build:dummy', function buildDummy() {
  return gulp.src(['test/dummy/src/javascripts/main.js'])
    .pipe((browserify({ transform: ['6to5ify' ]})))
    .pipe(gulp.dest('test/dummy/dist/javascripts'));
});

gulp.task('dev', function watch() {
  sync({
    server: { baseDir: './test/dummy/dist' }
  });

  gulp.watch(['src/**/*'], ['build']);
  gulp.watch(['src/**/*', 'test/dummy/src/**/*'], ['build:dummy']);
  gulp.watch(['test/dummy/javascripts/dist/**/*'], sync.reload);
});
