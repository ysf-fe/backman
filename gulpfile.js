var gulp = require('gulp');
var gulpSequence = require('gulp-sequence');
var rename = require('gulp-rename');
var changed = require('gulp-changed');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var cleancss = require('gulp-clean-css');
var sass = require('gulp-sass');
var debug = require('gulp-debug');

//文件列表
var files = {
    html: 'src/index.html',
    css: [
        'src/css/layout-*.scss',
        'src/css/skin-blue.scss',
        'src/css/element-*.scss',
        'src/css/directive-*.scss'
    ],
    config: 'src/config.js',
    services: 'src/services/*',
    controllers: 'src/controllers/*',
    directives: 'src/directives/*',
    filters: 'src/filters/*'
};

//发布js
gulp.task('backman-js', function () {
    return gulp.src([files.config, files.services, files.controllers, files.directives, files.filters])
        .pipe(sourcemaps.init())
        .pipe(concat('backman.js'))
        .pipe(gulp.dest('build/backman/'))
        .pipe(uglify({mangle:false})) //不压缩变量名
        .pipe(rename({
            extname: '.min.js'
        }))
        .pipe(sourcemaps.write('.', {
            sourceRoot: 'build/backman/'
        }))
        .pipe(gulp.dest('build/backman/'));
});

//发布css
gulp.task('backman-css', function () {
    return gulp.src(files.css)
        .pipe(sass())
        .pipe(sourcemaps.init())
        .pipe(concat('backman.css'))
        .pipe(gulp.dest('build/backman/'))
        .pipe(cleancss())
        .pipe(rename({
            extname: '.min.css'
        }))
        .pipe(sourcemaps.write('.', {
            sourceRoot: 'build/backman/'
        }))
        .pipe(gulp.dest('build/backman/'));
});

//发布html
gulp.task('backman-html', function(){
    return gulp.src(files.html)
        .pipe(gulp.dest('build/'));
});

//发布
gulp.task('build', gulpSequence('backman-js', 'backman-css', 'backman-html'));
