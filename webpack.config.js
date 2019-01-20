const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// 分离css
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const env = process.env.NODE_ENV;
module.exports = {
  mode: 'development',
  entry: './src/main.js',
  devServer: {
    port: 8888, // 设置端口
    hot: true,  // 开启热更新
    open: true, // 自动打开浏览器
    quiet: true
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[chunkhash:8].js'
  },
  module: {
    rules: [
      {
        test: /\.(css|less|scss)$/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          {
            loader: 'css-loader'
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              plugins: [
                autoprefixer({
                  browsers: ['last 2 versions', 'Firefox ESR', '> 1%', 'ie >= 8', 'iOS >= 8', 'Android >= 4']
                })
              ]
            }
          }
        ]
      },
      {
        test: /\.(js|mjs|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          chunks: 'initial',
          name: 'common',
          minChunks: 2,
          maxInitialRequests: 5, // The default limit is too small to showcase the effect
          minSize: 0 // This is example is too small to create commons chunks
        },
        // 提取常用依赖作为vendor
        vendor: {
          test: /react|react-dom|redux|react-redux|redux-thunk|moment|axios/,
          chunks: 'all',
          name: 'vendor',
          priority: 10,
          enforce: true
        }
      }
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'react-template',
      filename: 'index.html',
      template: 'index.html',
      minify: {
        removeComments: true, //移除HTML中的注释
        collapseWhitespace: true //删除空白符与换行符
      }
    }),
    // 分离css
    new MiniCssExtractPlugin({
      filename: '[name].[chunkhash:8].css',
      chunkFilename: '[id].css'
    }),
    // new webpack.HotModuleReplacementPlugin()
  ]
};
