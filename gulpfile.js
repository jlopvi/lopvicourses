const gulp = require('gulp'),
    sass = require('gulp-sass'),
    pug = require('gulp-pug'),
    autoprefixer = require('gulp-autoprefixer'),
    gutil  = require('gulp-util'),
    browserify = require('browserify'),
    babelify = require('babelify'),
    source = require('vinyl-source-stream'),
    browserSync = require('browser-sync').create();

gulp.task('sass', () => {
    gulp.src('./src/sass/app.scss')
        .pipe(sass({
            outputStyle: 'compressed'
        }))
        .on('error', gutil.log)
        .pipe(autoprefixer('last 2 versions'))
        .pipe(gulp.dest('./dist/css'))
});

gulp.task('pug', () => {
    gulp.src('./src/views/*.pug')
        .pipe(pug({
            pretty: true
        }))
        .on('error', gutil.log)
        .pipe(gulp.dest('./dist/'))
})

// gulp.task('babel', () =>
// 	gulp.src('./src/js/*.js')
// 		.pipe(babel({
// 			presets: ['env']
//         }))
//         .on('error', gutil.log)
// 		.pipe(gulp.dest('./dist/js'))
// );

gulp.task('scripts', () => {
    return browserify({
        entries: './src/js/app.js',
        extensions:  ['.js'],
        debug: true
    })
    .transform(babelify, {presets: ["env"]})
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./dist/js/'))
})


gulp.task('serve', ['sass', 'pug', 'scripts'], function() {

    browserSync.init({
        server: "./dist"
    });

    gulp.watch('./src/views/**/*.pug', ['pug']).on('change', browserSync.reload);
    gulp.watch('./src/sass/**/*.scss', ['sass']).on('change', browserSync.reload);
    gulp.watch('./src/js/**/*.js', ['scripts']).on('change', browserSync.reload);
});


gulp.task('default',['serve'])