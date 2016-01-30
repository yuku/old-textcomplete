var gulp        = require('gulp');

var babelify    = require('babelify');
var browserify  = require('browserify');
var source      = require('vinyl-source-stream');
 
gulp.task('build', function () {
    return browserify({entries: './src/index.js', debug: true})
        .transform('babelify', {presets: ['es2015']})
        .bundle()
        .pipe(source('index.js'))
        .pipe(gulp.dest('./dist'));
});
 
gulp.task('watch', ['build'], function () {
    gulp.watch('./src/*.js', ['build']);
});
 
gulp.task('default', ['build', 'watch']);
