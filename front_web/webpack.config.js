const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const dotenv = require('dotenv').config()

module.exports = {
  mode: process.env.mode,
  target: 'node',
  entry: './src/index.js',
  output: {
    path: __dirname + '/dist',
    filename: '[name].js',
    // publicPath: './',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: '/node_modules/',
        loader: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
      },
      {
        test: /\.(png|jpg|webp|gif|mp3)$/,
        use: ['file-loader'],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new webpack.DefinePlugin({
      mode: process.env.mode,
      port: process.env.port,
    }),
  ],
  devServer: {
    host: 'localhost',
    port: process.env.port,
    // open: true,
    historyApiFallback: true,
    hot: true,
  },
}
