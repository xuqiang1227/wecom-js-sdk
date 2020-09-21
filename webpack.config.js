'use strict';

let path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

console.log(path.join(__dirname, './src'));

module.exports = {
  mode: 'production',
  entry: {
    index: './src/index.ts'
  },
  output: {
    path: path.join(__dirname, './dist'),
    filename: 'weCom.js',
    libraryTarget: "umd"
  },
  module: {
    rules: [{
      test: /\.ts?$/,
      use: 'ts-loader',
      exclude: /node_modules/
    }]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  plugins: [
    new BundleAnalyzerPlugin()
  ]
};