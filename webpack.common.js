const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin');
const dist = path.join(__dirname, "dist")
const src = path.join(__dirname, "src")
const { _title } = require("./package.json")

// webpack4 defaults:
//   target: "web"
//   entry: "./src/index.js"
//   output path: dist/

const config = {
  node: {
    fs: "empty" // XXX needed due to a bug in Webpack 4, remove
  },
  plugins: [
    new CleanWebpackPlugin(["dist"]),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      minify: {
        collapseWhitespace: true
      }
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.(png|svg|jpe?g|gif)$/,
        use: [
          "file-loader"
        ]
      },
      {
        test: /\.(html)/,
        use: {
          loader: "html-loader",
          options: {
            attrs: ["img:src", "link:href"]
          }
        }
      }
    ]
  }
}

module.exports = { dist, src, config }
