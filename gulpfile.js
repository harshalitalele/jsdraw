// include gulp
var gulp = require('gulp');
var concat = require('gulp-concat');
var del = require('del');
//Strip console, alert, and debugger statements
var stripDebug = require('gulp-strip-debug');
var minifyjs = require('gulp-minify');
/*var minifyHTML = require('gulp-htmlmin');
var minifyCSS = require('gulp-clean-css');*/


gulp.task('clean', function () {
    del.sync(['./build']);
});

gulp.task('pack-js', function () {
    return gulp.src(['src/drawingboard.js', 'src/sub-elements/toolbox.js', 'src/sub-elements/overlay.js', 'src/sub-elements/actions/action.js', 'src/sub-elements/actions/freeformaction.js'])
        .pipe(concat('jsdraw.js'))
        .pipe(minifyjs())
        .pipe(stripDebug())
        .pipe(gulp.dest('build'));
});

gulp.task('pack-css', function () {
    return gulp.src(['src/css/*.css', 'src/modules/*/*.css'])
        .pipe(concat('stylesheet.css'))
        .pipe(minifyCSS())
        .pipe(gulp.dest('build'));
});

gulp.task('pack-html', function () {
    return gulp.src(['src/modules/*/*.html'])
        .pipe(minifyHTML())
        .pipe(gulp.dest(function (file) {
            return file.base;
        }));
});

gulp.task('default', ['clean', 'pack-js']);
