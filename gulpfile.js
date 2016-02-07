var gulp = require('gulp');
var path = require('path');

require('babel-register');

var paths = {
  dist: './dist/',
  src: {
    js: './src/*.js',
    entry: 'index.js',
  },
  test: {
    js: './test/*.js',
    dest: './powered-test/',
    runner: 'test-runner.js',
  },
};

gulp.task('lint', function () {
  var eslint = require('gulp-eslint');
  return gulp.src([paths.src.js, paths.test.js])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});
 
gulp.task('build', ['lint'], function () {
  var browserify = require('browserify');
  var rename = require('gulp-rename');
  var buffer = require('vinyl-buffer');
  var uglify = require('gulp-uglify');
  var sourcemaps = require('gulp-sourcemaps');
  var source = require('vinyl-source-stream');
  return browserify({ entries: path.join(path.dirname(paths.src.js), paths.src.entry) })
    .transform('babelify')
    .bundle()
    .pipe(source(paths.src.entry))
    .pipe(rename('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('watch', ['build'], function () {
  gulp.watch(paths.src.js, ['build']);
});

gulp.task('istanbul', function () {
  var isparta = require('isparta');
  var istanbul = require('gulp-istanbul');
  return gulp.src(paths.src.js)
    .pipe(istanbul({
      instrumenter: isparta.Instrumenter,
    }))
    .pipe(istanbul.hookRequire());
});

gulp.task('power-assert', function () {
  var espower = require('gulp-espower');
  return gulp.src(paths.test.js)
    .pipe(espower())
    .pipe(gulp.dest(paths.test.dest));
});

gulp.task('test', ['power-assert', 'istanbul'], function () {
  var mocha = require('gulp-mocha');
  var istanbul = require('gulp-istanbul');
  return gulp.src(path.join(paths.test.dest, paths.test.runner))
    .pipe(mocha())
    .pipe(istanbul.writeReports());
});
 
gulp.task('default', ['watch']);
