const gulp = require('gulp');
const babel = require("gulp-babel");

const fs = require('fs');
const path = require('path');
const Stream = require('stream');
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
        switch (req.url) {
          case '/style.css':
            fs.createReadStream('./src/style.css').pipe(res);
            return;

          default:
            fs.createReadStream('./demo/index.html').pipe(res);
        }
      }
    ],
  });
});

gulp.task('release:copyJs', () => {
  return gulp.src([
    'src/Draft/*.js',
  ])
  .pipe(gulp.dest('lib/Draft'));
});

gulp.task('release:copyCss', () => {
  return gulp.src('src/style.css')
  .pipe(gulp.dest('lib'));
});

class Svg2ReactComp extends Stream.Transform {
  constructor(compName) {
    super();
    this.compName = compName;
    this.head();
  }

  head() {
    this.push(
      `import React from 'react';\nconst ${this.compName} = () => (\n  ` +
      `<div dangerouslySetInnerHTML={{__html: '`
    );
  }

  foot() {
    this.push(
      `'}} />\n);\nexport default ${this.compName};`
    );
  }

  _transform(chunk, encoding, next) {
    this.push(chunk.toString());
    next();
  }

  _flush(next) {
    this.foot()
    next();
  }
}

gulp.task('icon', () => {
  const icons = [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'quote',
    'b', 'i', 'u',
    'link', 'image', 'format',
  ];
  const root = './src';
  const indexFile = fs.createWriteStream(path.join(root, 'Icons/index.js'));
  icons.forEach(iconName => {
    const compName = iconName.charAt(0).toUpperCase() + iconName.slice(1);
    const ws = fs.createWriteStream(path.join(root, 'Icons', compName + '.jsx'));
    const svg2Comp = new Svg2ReactComp(compName);
    fs.createReadStream(path.join(root, 'svg', iconName + '.svg'))
    .pipe(svg2Comp)
    .pipe(ws);
    indexFile.write(
      `import ${compName} from './${compName}';\nexport {${compName}};\n\n`
    );
  });
});

gulp.task('release', ['release:copyJs', 'release:copyCss', 'icon'], () => {
  return gulp.src([
    'src/*.jsx',
    'src/**/*.js',
    'src/**/*.jsx',
    '!src/Draft/*.js',
  ])
  .pipe(babel())
  .pipe(gulp.dest('lib'));
});

gulp.task('default', ['dev']);
