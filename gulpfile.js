var gulp = require('gulp');
var connect = require('gulp-connect');

var paths = {
  bundle: 'textcomplete.js',
  bundlemin: 'textcomplete.min.js',
  dist: 'dist/',
  doc: {
    dest: 'textcomplete/',
    js: 'src/doc/main.js',
    css: 'src/doc/*.css',
    jade: 'src/doc/*.jade',
  },
  entry: 'lib/main.js',
  lib: 'lib/',
  powered: 'powered-test/',
  src: 'src/*.js',
  test: 'test/*.js',
  testrunner: 'test-runner.js',
};

gulp.task('clean', () => {
  var del = require('del');
  return del([paths.dist, paths.lib]);
});

gulp.task('babel', () => {
  var babel = require('gulp-babel');
  return gulp.src(paths.src)
    .pipe(babel())
    .pipe(gulp.dest('lib'));
});

gulp.task('browserify', ['babel'], () => {
  var browserify = require('browserify');
  var source = require('vinyl-source-stream');
  return browserify({ entries: [paths.entry] })
    .bundle()
    .pipe(source(paths.bundle))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('compile', ['browserify'], () => {
  var uglify = require('gulp-uglify');
  var rename = require('gulp-rename');
  var sourcemaps = require('gulp-sourcemaps');
  var path = require('path');
  return gulp.src(path.join(paths.dist, paths.bundle))
    .pipe(rename(paths.bundlemin))
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('lint', () => {
  var eslint = require('gulp-eslint');
  return gulp.src([paths.src, paths.test])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('istanbul', () => {
  var isparta = require('isparta');
  var istanbul = require('gulp-istanbul');
  return gulp.src(paths.src)
    .pipe(istanbul({
      instrumenter: isparta.Instrumenter,
    }))
    .pipe(istanbul.hookRequire());
});

gulp.task('power-assert', () => {
  require('babel-register');
  var espower = require('gulp-espower');
  return gulp.src(paths.test)
    .pipe(espower())
    .pipe(gulp.dest(paths.powered));
});

gulp.task('mocha', ['power-assert', 'istanbul'], () => {
  var mocha = require('gulp-mocha');
  var istanbul = require('gulp-istanbul');
  var path = require('path');
  return gulp.src(path.join(paths.powered, paths.testrunner))
    .pipe(mocha())
    .pipe(istanbul.writeReports());
});

gulp.task('test', ['lint', 'mocha']);

gulp.task('server', () => {
  return connect.server({ root: './', livereload: true });
});

gulp.task('doc:html', () => {
  var jade = require('gulp-jade');
  return gulp.src(paths.doc.jade)
    .pipe(jade())
    .pipe(gulp.dest(paths.doc.dest))
    .pipe(connect.reload());
});

gulp.task('doc:css', () => {
  var autoprefixer = require('autoprefixer');
  var postcss = require('gulp-postcss');
  var precss = require('precss');
  var sourcemaps = require('gulp-sourcemaps');
  return gulp.src(paths.doc.css)
    .pipe(sourcemaps.init())
    .pipe(postcss([autoprefixer, precss]))
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest(paths.doc.dest))
    .pipe(connect.reload());
});
 
gulp.task('watch', ['doc:html', 'doc:css'], () => {
  var _ = require('lodash');
  var browserify = require('browserify');
  var gutil = require('gulp-util');
  var source = require('vinyl-source-stream');
  var watchify = require('watchify');

  var b = watchify(browserify(_.extend({}, watchify.args, {
    debug: true,
    entries: [paths.doc.js],
  })));
  b.transform('babelify');

  function bundle() {
    return b.bundle()
      .on('error', err => {
        gutil.log(err.message);
        gutil.log(err.stack);
      })
      .pipe(source('main.js'))
      .pipe(gulp.dest(paths.doc.dest))
      .pipe(connect.reload());
  }

  b.on('update', bundle);
  b.on('log', gutil.log);

  gulp.watch(paths.doc.jade, ['doc:html']);
  gulp.watch(paths.doc.css, ['doc:css']);

  return bundle();
});

gulp.task('default', ['server', 'watch']);
