// webpack.config.js

const path = require("path");
const webpack = require("webpack");

module.exports = {
  mode: "production",
  entry: "./src/index.tsx",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "AsanaChatbot.js",
    library: "AsanaChatbot",
    libraryTarget: "umd",
    globalObject: "this",
    libraryExport: "default",
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: "style-loader",
            options: {
              attributes: {
                "asana-chatbot": "",
              },
            },
          },
          "css-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.(svg|png)$/,
        use: ["file-loader"],
      },
    ],
  },
  resolve: {
    extensions: ["*", ".js", ".jsx", ".ts", ".tsx"],
  },
  plugins: [
    new webpack.ProvidePlugin({
      React: "react",
      ReactDOM: "react-dom",
    }),
  ],
};
