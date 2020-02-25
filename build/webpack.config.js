const merge = require("webpack-merge")
const path = require("path")
const webpack = require("webpack")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const commonConfig = require("./webpack.common.config.js")

// const minimist = require('minimist')
// const args = minimist(process.argv.slice(2))

// const env = args.env || 'pro'

const publicConfig = {
  entry: {
    app: ["babel-polyfill", path.join(__dirname, "../src/index.tsx")]
  },
  devtool: "cheap-module-source-map",
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "./index.ejs",
      filename: "index.html",
      chunks: ["vendor", "app"],
      hash: true,
      inject: true,
      templateParameters: {
        GLOBAL_ENV: "pro"
      }
    }),
    // new UglifyJSPlugin(),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: '"production"'
      }
    })
  ]
}

module.exports = merge(commonConfig, publicConfig)
