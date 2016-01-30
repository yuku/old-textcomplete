'use strict';

var gulp        = require('gulp');

var browserify  = require('browserify');
var buffer      = require('vinyl-buffer');
var eslint      = require('gulp-eslint');
var rename      = require('gulp-rename');
var source      = require('vinyl-source-stream');
var sourcemaps  = require('gulp-sourcemaps');
var uglify      = require('gulp-uglify');

gulp.task('lint', function () {
  return gulp.src('src/*.js')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});
 
gulp.task('build', ['lint'], function () {
  return browserify({entries: './src/index.js', debug: true})
    .transform('babelify')
    .bundle()
    .pipe(source('index.js'))
    .pipe(rename('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest('./dist'));
});
 
gulp.task('watch', ['build'], function () {
  gulp.watch('./src/*.js', ['build']);
});

gulp.task('test', ['lint']);
 
gulp.task('default', ['build', 'watch']);
