const path = require('path')

const resolve = d => path.join(__dirname, d)

module.exports = {
  entry: resolve('client/index.jsx'),
  output: {
    path: resolve('dist'),
    filename: 'bundle.js'
  },
  devtool: 'cheap-module-source-map',
  resolve: {
    modules: ['node_modules'],
    extensions: ['*', '.json', '.jsx', '.js'],
    alias: {
      app: resolve('client'),
      assets: resolve('client/assets'),
      components: resolve('client/components')
    }
  },
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loaders: [
          'babel-loader'
        ]
      },
      {
        test: /\.scss$/,
        loaders: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  }
}
