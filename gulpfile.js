var gulp        = require('gulp');

require('babel-register');

var browserify  = require('browserify');
var buffer      = require('vinyl-buffer');
var eslint      = require('gulp-eslint');
var espower     = require('gulp-espower');
var isparta     = require('isparta');
var istanbul    = require('gulp-istanbul');
var mocha       = require('gulp-mocha');
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

gulp.task('istanbul', function () {
  return gulp.src('./src/**/*.js')
    .pipe(istanbul({
      instrumenter: isparta.Instrumenter,
    }))
    .pipe(istanbul.hookRequire());
});

gulp.task('power-assert', function () {
  return gulp.src('./test/*.js')
    .pipe(espower())
    .pipe(gulp.dest('./powered-test/'));
});

gulp.task('test', ['power-assert', 'istanbul'], function () {
  return gulp.src('./powered-test/*.js')
    .pipe(mocha())
    .pipe(istanbul.writeReports());
});
 
gulp.task('default', ['build', 'watch']);
