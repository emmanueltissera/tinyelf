const path = require('path');

module.exports = {
  mode: "development",
  devtool: "hidden-nosources-source-map",
  entry: {
    main: "./src/Code.ts",
  },
  output: {
    clean: true,
    path: path.resolve(__dirname, './dist'),
    filename: "[name]-bundle.js" // <--- Will be compiled to this single file
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  module: {
    rules: [
      { 
        test: /\.tsx?$/,
        loader: "ts-loader"
      }
    ]
  }
};