const path = require("path");
const webpack = require("webpack");
const { CheckerPlugin } = require('awesome-typescript-loader');
const distDir = path.join(__dirname, "public", "build");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
module.exports = {
  entry: [
    "./src/index.tsx"
  ],

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },
  devtool: process.env.WEBPACK_DEVTOOL || "source-map",
  mode: process.env.NODE_ENV,

  output: {
    path: distDir,
    publicPath: "/build/",
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader',
        options: {
          useCache: true
        }
      }
    ]
  },
  plugins: [
    new CheckerPlugin(),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        // "browser", "electron"
        RUNTIME_TARGET: JSON.stringify(process.env.RUNTIME_TARGET)
      }
    })
  ].concat(process.env.NODE_ENV !== "production" ? [] : [
    new webpack.optimize.UglifyJsPlugin()
  ]
  ).concat(process.env.WEBPACK_ANALYZE === undefined ? [] : [
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: 'output/app.report.html',
    })
  ])
};
