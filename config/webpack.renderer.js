const path = require("path");

const base = require('./webpack.base');

const renderProcessConfig = Object.assign({}, base, {
  entry: "./src/index.tsx",
  output: {
    path: path.resolve(__dirname, "../public"),
    filename: "build/bundle.js",
  },
});

module.exports = renderProcessConfig;
