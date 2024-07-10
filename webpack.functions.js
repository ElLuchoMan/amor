const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: {
    'update-token': './update-token.js',
    'get-token': './get-token.js',
    'get-text': './get-text.js',
    'get-songs': './get-songs.js',
    'get-resources': './get-resources.js',
    'update-songs': './update-songs.js',
    'update-resources': './update-resources.js',
  },
  target: 'node',
  externals: [nodeExternals()],
  output: {
    path: path.resolve(__dirname, 'functions-build'),
    filename: '[name].js',
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
};
