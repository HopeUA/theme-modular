var gulp         = require('gulp'),
    sourcemaps   = require('gulp-sourcemaps'),
    less         = require('gulp-less'),
    watch        = require('gulp-watch'),
    concat       = require('gulp-concat'),
    autoprefixer = require('gulp-autoprefixer');

/**
 * Compile less files into css
 * Add prefixes
 * Generate source map
 * Repair image path
 */
gulp.task('theme-less', function(){

    gulp.src('src/less/main.less')
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(sourcemaps.write(
            './',
            {
                includeContent: false,
                sourceRoot: '../src/less'
            }
        ))
        .pipe(gulp.dest('dist/css'));

    gulp.src([
        'src/js/vendor/jquery-2.1.3.min.js',
        'src/js/main.js'
    ])
    .pipe(sourcemaps.init())
    .pipe(concat('app.js'))
    .pipe(sourcemaps.write(
        './',
        {
            includeContent: false,
            sourceRoot: '../src/js'
        }
    ))
    .pipe(gulp.dest('dist/js'));
});


/**
 * Watch changes on less files
 */
gulp.task('watch', function(){
    gulp.watch(
        [
            'src/less/*.less',
            'src/less/*.css',
            'src/less/**/*.less',
            'src/js/*.js',
            'src/js/**/*.js'
        ],
        ['theme-less']
    );
});

gulp.task('default', ['watch']);
