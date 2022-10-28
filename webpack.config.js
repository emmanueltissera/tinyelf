/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const GasPlugin = require("gas-webpack-plugin");

module.exports = {
  context: __dirname,
  mode: "development",
  devtool: "hidden-nosources-source-map",
  entry: {
    app: ["./build/src/Code.js", "./build/src/SimpleTriggers.js"],
  },
  output: {
    clean: true,
    path: path.resolve(__dirname, "./dist"),
    filename: "code.gs",
  },
  plugins: [new GasPlugin()],
};
