const webpack = require("webpack");
const { CheckerPlugin } = require('awesome-typescript-loader');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.scss']
  },
  devtool: process.env.WEBPACK_DEVTOOL || "source-map",
  mode: process.env.NODE_ENV,

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader',
        options: {
          useCache: true
        }
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'typings-for-css-modules-loader?namedExport&modules&sass',
        ]
      },
    ]
  },
  plugins: [
    new CheckerPlugin(),
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
