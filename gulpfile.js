//to do:
// browser reporter and reporter!
//consider using 'rename' pluggin for .min files
//mqpacker
//parallel
//cache
//os
// ditch notify?
//maybe get rid of simple-vars?

var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    imageResize = require('gulp-image-resize'),
    parallel = require('concurrent-transform'),
    os = require('os'),
    htmlmin = require('gulp-htmlmin'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload;


var postcss = require('gulp-postcss');
var cssImport = require('postcss-import');
var url = require("postcss-url");
var mixins = require('postcss-mixins');
var simpleVars = require('postcss-simple-vars');
var nested = require('postcss-nested');
var autoprefixer = require('autoprefixer');
var cssnext = require("postcss-cssnext");
var mqpacker = require('css-mqpacker');
var cssnano = require('cssnano');
var sourcemaps = require('gulp-sourcemaps');
var browserReporter = require("postcss-browser-reporter");
var reporter = require("postcss-reporter")
var lost = require('lost');
var fontMagician = require('postcss-font-magician');
var gutil = require('gulp-util');
var source = require('vinyl-source-stream');
var browserify = require('browserify');





gulp.task('css', function(){
  var processors = [
    cssImport,
    autoprefixer({browsers: ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4']}),
    cssnano,
    mixins,
    simpleVars,
    nested,
    mqpacker,
    browserReporter,
    reporter,
    fontMagician({ hosted: '../src/fonts' }),
    cssnext,
    lost
  ];
  return gulp.src('./src/css/*.css')
    .pipe(postcss(processors))
    .pipe(gulp.dest('./dist/css'));

});

// Static server for browser sync
gulp.task('browser-sync', function(){
  browserSync({
    server: {
      baseDir: "./"
    }
  });
});

// Concatenate & Minify
gulp.task('scripts', function(){
  return gulp.src('./src/js/*.js')
    .pipe(sourcemaps.init())
    .pipe(concat('app.js'))
    .pipe(gulp.dest('dist/js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('../maps'))
    .pipe(gulp.dest('dist/js'))
    .pipe(reload({stream:true}));
});


//browserify
gulp.task('browserify', function() {
  return browserify('./src/vendor/require.js')
  .bundle()
  .on('error', function(e){
    gutil.log(e);
  })
  .pipe(source('bundle.js'))
  .pipe(gulp.dest('dist/js'))
})

// Images
gulp.task('images', function(){
  return gulp.src(['./src/images/**/*', './src/images/**/**/*'])
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('dist/images'))
    // .pipe(notify({ message: 'Images task complete' }));
});

// HTML
gulp.task('html', function(){
  return gulp.src('src/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./'))
});

// Watch tasks
gulp.task('watch', function(){
  gulp.watch('./src/**/*.css', ['css', browserSync.reload]);
  
  gulp.watch('./src/**/*.js', ['scripts', browserSync.reload]);

  gulp.watch(['*.html','./src/*.html'], ['html', browserSync.reload]);
});


gulp.task('default', ['css', 'browser-sync', 'images', 'html', 'browserify', 'scripts', 'watch']);
