const path = require("path")
const webpack = require("webpack")
const ProgressBarPlugin = require("progress-bar-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")
// const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const prod = process.env.NODE_ENV === "production";

module.exports = {
  entry: {
    // app: [
    //     'babel-polyfill',
    //     path.join(__dirname, '../client/index.js')
    // ],
    vendor: ["react", "react-router-dom", "react-dom"]
  },
  target: "web",
  output: {
    path: path.join(__dirname, "../dist"),
    filename: "./js/[name].[chunkhash].js",
    chunkFilename: "./js/[name].[chunkhash].js",
    publicPath: "/"
  },
  optimization: {
    splitChunks: {
      chunks: "all",
      minChunks: 2,
      name: true,
      cacheGroups: {
        commons: {
          chunks: "initial",
          minChunks: 2
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          chunks: "all",
          priority: -10
        }
      }
    },
    runtimeChunk: true,
    minimizer: [new OptimizeCSSAssetsPlugin({})]
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        use: ["babel-loader?cacheDirectory=true"],
        include: path.join(__dirname, "../src"),
        exclude: "/node_modules/"
      },
      {
        test: /\.(css)$/,
        loaders: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // you can specify a publicPath here
              // by default it uses publicPath in webpackOptions.output
              publicPath: "/",
              hmr: !prod,
              reloadAll: true
            }
          },
          "css-loader",
        ]
      },
      // css
      {
        test: /\.(less)$/,
        exclude: /node_modules/,
        loaders: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // you can specify a publicPath here
              // by default it uses publicPath in webpackOptions.output
              publicPath: "/",
              hmr: !prod,
              reloadAll: true
            }
          },
          "css-loader?sourceMap=true",
          // {
          //     loader: 'postcss-loader',
          //     options: { sourceMap: true }
          // },
          {
            loader: "smart-px2rem-loader",
            options: {
              sourceMap: true,
              remUnit: 100,
              remPrecision: 5,
              excludes: [
                "border",
                "border-top",
                "border-right",
                "border-bottom",
                "border-left",
                "border-width",
                "border-top-width",
                "border-right-width",
                "border-bottom-width",
                "border-left-width"
              ]
            }
          },
          "less-loader?sourceMap=true"
        ]
      },
      {
        test: /\.(svg|otf|ttf|woff2?|eot|gif|png|jpe?g)(\?\S*)?$/,
        loader: "url-loader",
        query: {
          limit: 10000,
          name: path.posix.join("static", "[name].[hash:7].[ext]")
        }
      }
    ]
  },
  plugins: [
    new ProgressBarPlugin(),
    new MiniCssExtractPlugin({
      filename: "style/[name].css",
      chunkFilename: !prod ? "[id].css" : "style/[id].[contenthash].css",
      ignoreOrder: false // Enable to remove warnings about conflicting order
    }),
    new webpack.HashedModuleIdsPlugin(),
    // new ForkTsCheckerWebpackPlugin()
  ],
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
    alias: {
      "@": path.resolve(__dirname, "../src/")
    },
  },
  node: {
    // workaround for webpack-dev-server issue
    // https://github.com/webpack/webpack-dev-server/issues/60#issuecomment-103411179
    fs: "empty",
    net: "empty"
  },
  performance: {
    hints: false
  },
}
