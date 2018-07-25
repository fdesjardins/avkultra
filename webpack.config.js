const cesiumSource = 'node_modules/cesium/Source'
const cesiumWorkers = '../Build/Cesium/Workers'
const path = require('path')
const webpack = require('webpack')
const CopywebpackPlugin = require('copy-webpack-plugin')
const HTMLWebpackPlugin = require('html-webpack-plugin')

const dev = process.env.NODE_ENV !== 'production'

const resolve = d => path.join(__dirname, d)

const HTMLWebpackPluginConfig = new HTMLWebpackPlugin({
  template: resolve('server/index.html'),
  filename: 'index.html',
  inject: 'body'
})

module.exports = {
  devServer: {
    host: '0.0.0.0',
    port: '3000',
    hot: true,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    historyApiFallback: true
  },
  entry: ['react-hot-loader/patch', resolve('client/index.js')],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: ['babel-loader']
      },
      {
        test: /\.(css|scss)$/,
        loader: 'style-loader!css-loader!sass-loader'
      },
      {
        test: /\.(jpe?g|png|gif|svg|gltf)$/i,
        loader: 'url-loader',
        options: {
          limit: 10000
        }
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      '-': resolve('client'),
      cesium: resolve(cesiumSource)
    }
  },
  output: {
    filename: 'index.js',
    path: resolve('dist'),
    sourcePrefix: ''
  },
  mode: dev ? 'development' : 'production',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': dev
        ? JSON.stringify('development')
        : JSON.stringify('production')
    }),
    HTMLWebpackPluginConfig,
    new webpack.HotModuleReplacementPlugin(),
    new CopywebpackPlugin([
      { from: path.join(cesiumSource, cesiumWorkers), to: 'Workers' }
    ]),
    new CopywebpackPlugin([
      { from: path.join(cesiumSource, 'Assets'), to: 'Assets' }
    ]),
    new CopywebpackPlugin([
      { from: path.join(cesiumSource, 'Widgets'), to: 'Widgets' }
    ]),
    new webpack.DefinePlugin({
      CESIUM_BASE_URL: JSON.stringify('')
    })
  ],
  amd: {
    toUrlUndefined: true
  },
  node: {
    fs: 'empty'
  }
}
