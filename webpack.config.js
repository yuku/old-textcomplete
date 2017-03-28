/* eslint-env node */

const path = require('path');

module.exports = {
  devtool: 'source-map',
  entry: {
    textcomplete: './src/main.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
    ],
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'textcomplete.js',
  },
};
