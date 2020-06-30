var gulp = require('gulp');
var sass = require('gulp-sass');
var cleanCss = require('gulp-clean-css');
var rename = require('gulp-rename');
var composer = require('gulp-uglify/composer');
var uglifyEs = require('uglify-es');
var uglify = composer(uglifyEs, console);
var autoprefixer = require('gulp-autoprefixer');
var del = require('del');
var runSequence = require('run-sequence');

var paths = {
  dist: {
      base: 'dist',
      img:  'dist/assets/img',
      libs: 'dist/assets/vendor'
  },
  src: {
      index: '/index.html',
      base: './',
      css:  'assets/css',
      js:   'assets/js',
      html: '**/*.html',
      img:  'assets/img/**/*.+(png|jpg|gif|svg)',
      scss: 'assets/scss/*.scss'
  }
}

// Compile SCSS
gulp.task('compile-css', function() {
  return gulp.src(paths.src.scss)
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(gulp.dest(paths.src.css))
});

// Minify CSS
gulp.task('min-css', function() {
  return gulp.src([
        paths.src.css + '/argon-design-system.css'
    ])
    .pipe(cleanCss())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.src.css))
});

// Minify JS
gulp.task('min-js', function() {
  return gulp.src([
          paths.src.js + '/argon-design-system.js'
      ])
      .pipe(uglify())
      .pipe(rename({ suffix: '.min' }))
      .pipe(gulp.dest(paths.src.js))
});

// Clean
gulp.task('clean-dist', function() {
  return del.sync(paths.dist.base);
});

// Copy CSS
gulp.task('copy-css', function() {
  return gulp.src([
      'assets/css/argon-design-system.min.css',
      'assets/css/font-awesome.css',
      'assets/css/nucleo-icons.css',
      'assets/css/nucleo-svg.css'
  ])
  .pipe(gulp.dest(paths.dist.base + '/assets/css'))
});

// Copy JS
gulp.task('copy-js', function() {
  return gulp.src([
      'assets/js/argon-design-system.min.js',
      'assets/js/**/core/*',
      'assets/js/**/plugins/*'
  ])
  .pipe(gulp.dest(paths.dist.base + '/assets/js'))
});

// Copy assets
gulp.task('copy-assets', function() {
  return gulp.src([
      'assets/**/fonts/*',
      'assets/**/img/**'
  ])
  .pipe(gulp.dest(paths.dist.base + '/assets'))
});

// Copy root
gulp.task('copy-root', function() {
  return gulp.src([
      '*.html'
  ])
  .pipe(gulp.dest(paths.dist.base))
});

// Default
gulp.task('default',
  runSequence(['compile-css', 'min-css', 'min-js'])
);

// Build
gulp.task('dist',
  runSequence(['clean-dist', 'compile-css', 'min-css', 'min-js', 'copy-assets', 'copy-css', 'copy-js', 'copy-root'])
);