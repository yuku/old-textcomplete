var gulp = require('gulp');
 
gulp.task('build', function () {
 
});
 
gulp.task('watch', ['build'], function () {
    gulp.watch('./src/js/*.js', ['build']);
});
 
gulp.task('default', ['build', 'watch']);
