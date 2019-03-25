const path = require("path")
const merge = require("webpack-merge")
const MiniCSSExtractPlugin = require("mini-css-extract-plugin")
const UglifyCSSPlugin = require("optimize-css-assets-webpack-plugin")
const CompressionPlugin = require("compression-webpack-plugin")
const { config, src } = require("./webpack.common.js")

// split js bundle into 3 parts for better client caching:
//   1. webpack4 runtime
//   2. large vendor runtimes (can be split further)
//   3. app runtime

module.exports = merge(config, {
  mode: "production", // webpack4 takes care of node_env and uglify
  plugins: [
    // default minRatio = .8
    new CompressionPlugin({
      deleteOriginalAssets: true
    }),
    // extract and compress/dedupe all css
    new UglifyCSSPlugin({}),
    new MiniCSSExtractPlugin({
      filename: "[contenthash].css"
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        include: src,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/,
        include: src,
        use: [MiniCSSExtractPlugin.loader, "css-loader"]
      }
    ]
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        // can split into many groups
        vendor: {
          chunks: "initial",
          name: "vendor",
          // can change to /react|p5|p5\/lib\/addons\/p5\.sound/, etc.
          test: path.resolve(__dirname, "node_modules"),
          enforce: true
        }
      }
    },
    runtimeChunk: true
  },
  output: {
    filename: "[contenthash].js"
  },
})
