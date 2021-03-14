const path = require('path');
var webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const dotenv = require('dotenv')


module.exports = {
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: '/'

  },
  resolve: {
    modules: [path.join(__dirname, 'src'), 'node_modules'],
    alias: {
      react: path.join(__dirname, 'node_modules', 'react'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
        ],
      },
      {
        test: /\.(png|jp(e*)g|svg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'images/[hash]-[name].[ext]',
            },
          },
        ],
      },

    ],
  },
  devServer: {
    historyApiFallback: true,
  },

  plugins: [
    new HtmlWebPackPlugin({
      template: './src/index.html',
    }),
      new webpack.DefinePlugin({
        'process.env': JSON.stringify(dotenv.config().parsed) // it will automatically pick up key values from .env file
      })
  ],
};
