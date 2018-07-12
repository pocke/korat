const path = require("path");

const base = require('./webpack.base');

const renderProcessConfig = Object.assign({}, base, {
  target: 'electron-renderer',
  entry: "./src/index.tsx",
  output: {
    path: path.resolve(__dirname, "../public"),
    filename: "build/bundle.js",
  },
});

module.exports = renderProcessConfig;
