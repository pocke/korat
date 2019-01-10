const path = require('path');

const base = require('./webpack.base');

const mainProcessConfig = Object.assign({}, base, {
  target: 'electron-main',
  entry: {
    development: './src/electron.ts',
    production: './src/electron-prod.ts',
  },
  output: {
    path: path.join(__dirname, '../electron-built'),
    filename: 'electron-[name].js',
  },
});

module.exports = mainProcessConfig;
