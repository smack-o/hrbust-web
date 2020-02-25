const merge = require("webpack-merge")
const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const commonConfig = require("./webpack.common.config.js")

const defaultProxy = {
  "/api": {
    target: "http://localhost:8090",
    changeOrigin: true
  }
}

const devConfig = {
  devtool: "cheap-module-source-map",
  entry: {
    app: [
      "babel-polyfill",
      "react-hot-loader/patch",
      path.join(__dirname, "../src/index.tsx")
    ]
  },
  output: {
    filename: "[name].[hash].js"
  },
  devServer: {
    port: 8999,
    disableHostCheck: true,
    contentBase: path.join(__dirname, "./dist"),
    historyApiFallback: true,
    host: "0.0.0.0",
    proxy: {
      // 默认代理 list
      ...defaultProxy
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "../index.ejs"),
      templateParameters: {
        description: "",
        keywords: ""
      }
    })
  ]
}
module.exports = merge(commonConfig, devConfig)
