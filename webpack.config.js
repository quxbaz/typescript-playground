var path = require('path')
var webpack = require('webpack')

module.exports = {

  entry: path.resolve(__dirname, 'src/index.tsx'),
  devtool: 'inline-source-map',

  output: {
    filename: 'bundle.js',
    publicPath: '/assets/',
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        include: path.resolve(__dirname, 'src'),
      }
    ]
  },

  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
  },

}
