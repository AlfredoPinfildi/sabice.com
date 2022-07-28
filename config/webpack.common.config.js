const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const path = require("path");

const babelConfigPath = path.join(__dirname, "babel.config.js");
const rootPath = path.resolve(__dirname, "..");
const distPath = path.join(rootPath, "dist");

const pages = require("./pages.js");

module.exports = {
  entry: path.resolve(rootPath, "/index.js"),
  output: {
    path: distPath,
    filename: "[name].js",
    clean: true,
    publicPath: "/",
  },
  devtool: "source-map",
  plugins: [
    new HtmlWebpackPlugin({
      filename: `index.html`,
      template: path.resolve(rootPath, "/index.html"),
    }),
    ...pages,
    new CopyWebpackPlugin({
      patterns: [
        "sw.js",
        {
          from: path.resolve(rootPath, "assets/icons/icon-192.png"),
          to: path.resolve(rootPath, "dist/assets/icons/icon-192.png"),
        },
        {
          from: path.resolve(rootPath, "assets/icons/icon-512.png"),
          to: path.resolve(rootPath, "dist/assets/icons/icon-512.png"),
        },
      ],
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
        loader: "file-loader",
        options: {
          name: "[path][name].[ext]",
        },
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
      "@pages": path.resolve(rootPath, "pages"),
      "@router": path.resolve(rootPath, "router"),
      "@data": path.resolve(rootPath, "data"),
      "@models": path.resolve(rootPath, "models"),
    },
  },
  stats: "errors-warnings",
  stats: {
    children: false,
  },
};
