const path = require('path');

const base = require('./webpack.base');

const renderProcessConfig = Object.assign({}, base, {
  target: 'electron-renderer',
  entry: {
    renderer: './src/renderer.tsx',
    preload: './src/preload/preload.ts',
  },
  output: {
    path: path.resolve(__dirname, '../public'),
    filename: 'build/[name].js',
  },
});

module.exports = renderProcessConfig;
