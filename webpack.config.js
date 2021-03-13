const nodeExternals = require("webpack-node-externals");
const path = require("path");
module.exports = {
  externals: [nodeExternals()],
  mode: "production",
  target: "node",
  entry: {
    shadow: "./src/shadowpool.ts",
    watch: "./watch/bot.ts",
  },
  output: {
    filename: "[name].js",
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: path.resolve(__dirname, "./src/core/view/front"),
      },
    ],
  },
};
