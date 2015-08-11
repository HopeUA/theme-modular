import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import del from 'del';
import run from 'run-sequence';

const $ = gulpLoadPlugins();

gulp.task('build:css', () => {
    gulp.src('src/less/main.less')
        .pipe($.sourcemaps.init())
        .pipe($.less())
        .pipe($.autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe($.sourcemaps.write(
            './', {
                includeContent: false,
                sourceRoot: '../src/less'
            }
        ))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('build:js', () => {
    gulp.src([
        'src/js/vendor/jquery-2.1.3.min.js',
        'src/js/vendor/jquery.easing.1.3.js',
        'src/js/vendor/jquery.bez.min.js',
        'src/js/vendor/moment-with-locales.js',
        'src/js/vendor/jquery.color.js',
        'src/js/vendor/jquery.scrollTo.js',
        'src/js/plugins/*.js',
        'src/js/content/*.js',
        'src/js/pages/*.js',
        'src/js/bannerMain.js',
        'src/js/timeline.js',
        'src/js/button-up.js'
    ])
        .pipe($.sourcemaps.init())
        .pipe($.concat('app.js'))
        .pipe($.sourcemaps.write(
            './', {
                includeContent: true,
                sourceRoot: '../src/js'
            }
        ))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('copy:html', () => {
    gulp
        .src([
            'src/*.html'
        ])
        .pipe(gulp.dest('dist'));
});

gulp.task('copy:ajax', () => {
    gulp
        .src([
            'src/ajax/*.*'
        ])
        .pipe(gulp.dest('dist/ajax'));
});

gulp.task('copy:images', () => {
    gulp
        .src([
            'src/img/**/*.*'
        ])
        .pipe(gulp.dest('dist/img'));
});

gulp.task('copy:fonts', () => {
    gulp
        .src([
            'src/fonts/**/*.*'
        ])
        .pipe(gulp.dest('dist/css/fonts'));
});

gulp.task('copy', [
    'copy:html',
    'copy:images',
    'copy:fonts',
    'copy:ajax'
]);

gulp.task('clean', done => {
    del([
        'dist'
    ], done);
});

gulp.task('build', done => {
    run(
        'clean',
        'copy',
        ['build:js', 'build:css'],
        done
    );
});

gulp.task('watch', () => {
    gulp.watch(
        [
            'src/less/*.less',
            'src/less/*.css',
            'src/less/**/*.less',
            'src/js/*.js',
            'src/js/**/*.js',
            'src/*.html'
        ], ['build']
    );
});