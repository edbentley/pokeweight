const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/Index.bs.js',
  mode: 'production',
  output: {
    path: path.join(__dirname, "dist"),
    filename: 'index.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "indexProduction.html"
    })
  ]
};
