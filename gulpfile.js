var gulp = require('gulp');
var inject = require('gulp-inject');

var js = [
    // vendor
    './bower_components/*/dist/*.min.js',
    
    // our stuff
    './scripts/**/*.js',
];

gulp.task('inject', function () {
    var target = gulp.src('./index.html');
    
    // It's not necessary to read the files (will speed up things), we're only after their paths: 
    var sources = gulp.src(js, {read: false});

    return target.pipe(inject(sources))
                 .pipe(gulp.dest('./'));
});

