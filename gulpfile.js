const gulp = require('gulp');
const babel = require("gulp-babel");

const fs = require('fs');
const bs = require('browser-sync').create();
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const webpackConfig = require('./webpack.config');

let compiler;

gulp.task('dev', () => {
  compiler = webpack(webpackConfig);
  compiler.plugin('done', function (stats) {
    if (stats.hasErrors() || stats.hasWarnings())
      return;
    bs.reload();
  });
  bs.init({
    open: false,
    middleware: [
      webpackDevMiddleware(compiler, {
        publicPath: webpackConfig.output.publicPath,
        noInfo: true,
      }),
      (req, res, next) => {
        fs.createReadStream('./demo/index.html').pipe(res);
      }
    ],
  });
});

gulp.task('release:copy', () => {
  return gulp.src([
    'src/Draft/*.js',
  ])
  .pipe(gulp.dest('lib/Draft'));
});

gulp.task('release', ['release:copy'], () => {
  return gulp.src([
    'src/*.jsx',
    'src/**/*.js',
    '!src/Draft/*.js',
  ])
  .pipe(babel())
  .pipe(gulp.dest('lib'));
});

gulp.task('default', ['dev']);
