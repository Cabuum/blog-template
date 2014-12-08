var gulp        = require('gulp');
var jade        = require('gulp-jade');
var browserify  = require('browserify');
var source      = require('vinyl-source-stream');
var uglify      = require('gulp-uglify');
var streamify   = require('gulp-streamify');
var gulpif      = require('gulp-if');
var sass        = require('gulp-sass');
var connect     = require('gulp-connect');
var plumber     = require('gulp-plumber');

var env =process.env.NODE_ENV || 'development';
var outputDir = 'builds/development';

gulp.task('jade', function () {
    return gulp.src('src/templates/**/*.jade')
        .pipe(jade())
        .pipe(gulp.dest(outputDir))
        .pipe(connect.reload());
});

gulp.task('js', function () {
    return browserify('./src/js/main', { debug: env === 'development' })
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulpif(env === 'production', streamify(uglify())))
        .pipe(gulp.dest(outputDir + '/js'))
        .pipe(connect.reload());
});

gulp.task('sass', function () {
    var config = {};
    if (env === 'development') {
        config.sourceComments = 'map';
    }else if(env === 'production') {
        config.outputStyle = 'compressed';
    }
    return gulp.src('src/sass/main.scss')
        .pipe(sass(config))
        .pipe(gulp.dest(outputDir + '/css'))
        .pipe(connect.reload());
});

gulp.task('watch', function () {
    gulp.watch('src/templates/**/*.jade', ['jade']);
    gulp.watch('src/js/**/*.js', ['js']);
    gulp.watch('src/sass/**/*.scss', ['sass']);
});

gulp.task('connect', function () {
    connect.server({
        root: [outputDir],
        livereload: true
    });
});

gulp.task('default', ['js', 'jade', 'sass', 'watch', 'connect']);