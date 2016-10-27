// reference: https://github.com/Browsersync/recipes/tree/master/recipes/webpack.babel
const fs = require('fs');
const bs = require('browser-sync').create();
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const webpackConfig = require('./webpack.config');
const compiler = webpack(webpackConfig);

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
      fs.createReadStream('index.html').pipe(res);
    }
  ],
});
