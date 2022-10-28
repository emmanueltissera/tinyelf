// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
const path = require("path");

// eslint-disable-next-line no-undef
module.exports = {
  mode: "development",
  devtool: "hidden-nosources-source-map",
  entry: {
    app: ['./src/Code.ts', './src/SimpleTriggers.ts']
  },
  output: {
    clean: true,
    // eslint-disable-next-line no-undef
    path: path.resolve(__dirname, "./dist"),
    filename: "code.js",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
      },
    ],
  },
};
