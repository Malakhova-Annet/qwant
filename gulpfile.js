let gulp = require('gulp');
let watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    cssmin = require('gulp-minify-css'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('gulp-pngquant'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify');


gulp.task('style:build', function () {
    return gulp.src('src/scss/**/*.scss')
        .pipe(sourcemaps.init()) //То же самое что и с js
        .pipe(sass().on('error', notify.onError(
            {
                message: "<%= error.message %>",
                title: "Sass Error!"
            }))) //Скомпилируем
        .pipe(prefixer()) //Добавим вендорные префиксы
        .pipe(cssmin()) //Сожмем
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('public/css'))
});


gulp.task('js:build', function () {
    return gulp.src('src/js/**/*.*')
        .pipe(sourcemaps.init())
        .pipe(concat('app.min.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('public/js'))
});

gulp.task('image:build', function () {
    return gulp.src('src/images/**/*.*') // Берем все изображения из app
        .pipe(imagemin({ // Сжимаем их с наилучшими настройками
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('public/images')); // Выгружаем на продакшен
});

gulp.task('watch', function () {
    watch(['src/scss/**/*.scss'], function () {
        gulp.start('style:build');
    });
    watch(['src/images/**/*.*'], function () {
        gulp.start('image:build');
    });
    watch(['src/js/**/*.*'], function () {
        gulp.start('js:build');
    });
    /*  watch([path.watch.js], function(event, cb) {
          gulp.start('js:build');
      });

      watch([path.watch.fonts], function(event, cb) {
          gulp.start('fonts:build');
      });*/
});

gulp.task('watch-full', ['image:build', 'js:build', 'style:build', 'watch']);