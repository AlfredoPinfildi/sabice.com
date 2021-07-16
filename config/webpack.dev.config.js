const { merge } = require("webpack-merge");
const path = require("path");

const commonConfig = require("./webpack.common.config.js");

const postcssConfigPath = path.join(__dirname, "postcss.config.js");

module.exports = merge(commonConfig, {
  mode: "development",
  optimization: {
    moduleIds: "named",
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          "style-loader",
          { loader: "css-loader", options: { importLoaders: 1 } },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                config: postcssConfigPath,
              },
            },
          },
        ],
      },
    ],
  },
  devServer: {
    disableHostCheck: true,
    host: "localhost",
    port: 8000,
    inline: true,
    hot: true,
    https: false,
    progress: true,
  },
});
