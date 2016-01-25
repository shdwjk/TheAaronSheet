/* File: gulpfile.js */

// grab our gulp packages
var gulp  = require('gulp'),
    gutil = require('gulp-util'),
    include = require('gulp-include'),
    jshint = require('gulp-jshint'),
    print = require('gulp-print'),

    jsGlob = [
        '../*.js',
        'gulpfile.js',
        'src/**/*.js'
    ];

    
gulp.task("examples", function(){
    console.log('-- Building examples ');

    debugger;

    gulp.src('templates/examples/*.html')
        .pipe(print())
        .pipe(include())
            .on('error',console.log)
        .pipe(gulp.dest('../examples'));
});

// create a default task and just log a message
gulp.task('default', ['watch']);

// gutil.log('Gulp is running!')


gulp.task('jshint', function() {
    return gulp.src( jsGlob )
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('watch', function() {
    gulp.watch( jsGlob , ['jshint']);
});
