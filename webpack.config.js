const path = require('path');
const webpack = require('webpack');

const pkg = require('./package.json');

const {NODE_ENV = 'development'} = process.env;
const isProd = NODE_ENV === 'production';

module.exports = {
  entry: {
    main: './src/index.jsx',
    vendor: [
      'babel-polyfill',
      'react',
      'react-dom',
      'immutable',
      // 'draft-js',
    ],
  },
  output: {
    path: '/',
    publicPath: '/',
    filename: '[name].js',
  },
  resolve: {
    extensions: [
      '', '.webpack.js', '.web.js', '.js', '.jsx',
    ],
  },
  devtool: '#source-map',
  module: {
    loaders: [
      {
        test: /\.js(?:x)?$/,
        loader: 'babel',
        exclude: /node_modules/,
        query: {
          presets: ['react', 'es2015', 'stage-2'],
        },
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
      VERSION: JSON.stringify(pkg.version),
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity,
      filename: isProd ? '[chunkhash].js' : '[name].js',
    }),
  ],
};
