const path = require("path");

const base = require('./webpack.base');

const mainProcessConfig = Object.assign({}, base, {
  target: 'electron-main',
  entry: "./src/electron.ts",
  output: {
    path: path.join(__dirname, '../dist'),
    filename: "electron.js",
  },
});

module.exports = mainProcessConfig;
