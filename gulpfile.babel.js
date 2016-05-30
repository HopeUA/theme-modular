import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import del from 'del';
import run from 'run-sequence';

const $ = gulpLoadPlugins();

gulp.task('build:css', () => {
    return gulp.src('src/less/main.less')
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
   return gulp.src([
       'src/js/vendor/jquery/dist/jquery.min.js',
       'src/js/vendor/moment/min/moment-with-locales.min.js',
       'src/js/vendor/moment-timezone/builds/moment-timezone-with-data.min.js',
       'src/js/vendor/es6-promise/promise.min.js',
       'src/js/vendor/fetch/fetch.js',
       'src/js/vendor/uri.js/src/URI.min.js',
       'src/js/vendor/mustache.js/mustache.min.js',

       'src/js/vendor.manual/jquery.easing.1.3.js',
       'src/js/vendor.manual/jquery.bez.min.js',
       'src/js/vendor.manual/jquery.color.js',
       'src/js/vendor.manual/jquery.scrollTo.js',
       'src/js/vendor.manual/object-assign.js',
       'src/js/vendor.manual/flowplayer.min.js',
       // 'src/js/vendor.manual/dash.all.js',
       // 'src/js/vendor.manual/flowplayer.dashjs.js',
       // 'src/js/vendor.manual/flowplayer.dashjs.min.js',
       'src/js/vendor.manual/flowplayer.hlsjs.min.js',

       'src/js/config.js',
       'src/js/config-dev.js',

       'src/js/plugins/*.es6',
       'src/js/plugins/*.js',
       'src/js/plugins/api/*.es6',
       'src/js/content/*.js',
       'src/js/pages/*.js',
       'src/js/bannerMain.js',
       'src/js/timeline.js',
       'src/js/button-up.js'
   ])
        .pipe($.sourcemaps.init())
        .pipe($.babel({
           only: '*.es6'
       }))
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
    return gulp
        .src([
            'src/*.html'
        ])
        .pipe(gulp.dest('dist'));
});

gulp.task('copy:ajax', () => {
    return gulp
        .src([
            'src/ajax/*.*'
        ])
        .pipe(gulp.dest('dist/ajax'));
});

gulp.task('copy:tests', () => {
    return gulp
        .src([
            './node_modules/mocha/mocha.js',
            './node_modules/mocha/mocha.css',
            './node_modules/chai/chai.js',
            'src/js/tests/spec.js'
        ]).pipe(gulp.dest('dist/tests'));
});

gulp.task('copy:images', () => {
    return gulp
        .src([
            'src/img/**/*.*'
        ])
        .pipe(gulp.dest('dist/img'));
});

gulp.task('copy:fonts', () => {
    return gulp
        .src([
            'src/fonts/**/*.*'
        ])
        .pipe(gulp.dest('dist/css/fonts'));
});

gulp.task('copy', [
    'copy:html',
    'copy:images',
    'copy:fonts',
    'copy:ajax',
    'copy:tests'
]);

gulp.task('clean', done => {
    del([
        'dist'
    ], done);
});

gulp.task('build', done => {
    run(
        'copy',
        ['build:js', 'build:css'],
        done
    );
});

gulp.task('watch', () => {
    return gulp.watch(
        [
            'src/less/*.less',
            'src/less/*.css',
            'src/less/**/*.less',
            'src/js/*.js',
            'src/js/**/*.js',
            'src/js/**/*.es6',
            'src/*.html',
            'src/ajax/*.*',
            'src/img/*.*'
        ], ['build']
    );
});