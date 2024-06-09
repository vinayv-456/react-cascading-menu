const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const createStyledComponentsTransformer =
  require("typescript-plugin-styled-components").default;

const styledComponentsTransformer = createStyledComponentsTransformer();

module.exports = {
  // mode: "development", // 'production' or 'development'
  // entry: "./src/index.tsx", // library entry
  entry: "./example/src/index.js",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "index.js",
    library: "react-cascading-dropdown",
    libraryTarget: "umd",
    umdNamedDefine: true,
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./example/public/index.html",
      inject: "body", // This injects the script tags in the body of the HTML
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
      {
        test: /\.tsx?$/,
        use: {
          loader: "ts-loader",
          options: {
            getCustomTransformers: () => ({
              before: [styledComponentsTransformer],
            }),
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: "@svgr/webpack",
            options: {
              svgo: false,
            },
          },
        ],
      },
    ],
  },
};
