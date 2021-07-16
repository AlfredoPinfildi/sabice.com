const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");

const babelConfigPath = path.join(__dirname, "babel.config.js");
const rootPath = path.resolve(__dirname, "..");
const distPath = path.join(rootPath, "dist");

module.exports = {
  entry: path.resolve(rootPath, "/index.js"),
  output: {
    path: distPath,
    filename: "[name].js",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(rootPath, "/index.html"),
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: path.resolve(rootPath, "assets") }],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.html$/i,
        use: "html-loader",
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            extends: babelConfigPath,
            cacheDirectory: true,
          },
        },
      },
      {
        test: /\.(svg|woff2?|png|jpe?g|gif)$/i,
        use: "file-loader",
      },
    ],
  },
  resolve: {
    alias: {
      "@app": path.resolve(rootPath),
      "@assets": path.resolve(rootPath, "assets"),
      "@blocks": path.resolve(rootPath, "blocks"),
      "@components": path.resolve(rootPath, "components"),
      "@styles": path.resolve(rootPath, "styles"),
      "@utils": path.resolve(rootPath, "utils"),
    },
  },
  stats: "errors-warnings",
};
