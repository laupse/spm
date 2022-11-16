const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
  mode: "production",
  entry: "./src/app/poulet-mayonnaise.js",
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "bundle.js",
  },
  plugins: [new HtmlWebpackPlugin({
    template: "./src/index.html",
    scriptLoading: "blocking"
  })
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, "./dist"),
    },
    open: true,
    hot: true,
    port: 9000,
  },
};
