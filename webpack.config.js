/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require("webpack");
const path = require("path");
const fs = require("fs");
const GasPlugin = require("gas-webpack-plugin");
let bannerText = fs.readFileSync("./source-warning.md", "utf8");
bannerText += "\n" + fs.readFileSync("./licence.md", "utf8");

module.exports = {
  context: __dirname,
  mode: "development",
  devtool: "hidden-nosources-source-map",
  entry: {
    app: ["./build/src/Code.js", "./build/src/SimpleTriggers.js"]
  },
  output: {
    clean: true,
    path: path.resolve(__dirname, "./dist"),
    filename: "code.gs"
  },
  plugins: [new webpack.BannerPlugin(bannerText), new GasPlugin()]
};
