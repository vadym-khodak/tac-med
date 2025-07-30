const { join } = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './src/main.ts',
  target: 'node',
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    path: join(__dirname, 'dist'),
    filename: 'main.js',
    libraryTarget: 'commonjs2',
    clean: true,
  },
  externals: [
    nodeExternals({
      allowlist: []
    }),
    'aws-sdk'
  ],
  optimization: {
    minimize: false
  },
  devtool: 'source-map',
};