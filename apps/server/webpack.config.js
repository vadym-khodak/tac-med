const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join } = require('path');

module.exports = {
  output: {
    path: join(__dirname, 'dist'),
    filename: 'main.js',  // Ensure consistent output filename
    libraryTarget: 'commonjs2'  // Important for Lambda
  },
  target: 'node',  // Explicitly set target
  externals: ['aws-sdk'], // Exclude AWS SDK from bundle
  plugins: [
    new NxAppWebpackPlugin({
      target: 'node',
      compiler: 'tsc',
      main: './src/main.ts',
      tsConfig: './tsconfig.app.json',
      assets: ["./src/assets"],
      optimization: false,
      outputHashing: 'none',
      generatePackageJson: true,
    })
  ],
  optimization: {
    minimize: false  // Don't minimize for better Lambda debugging
  }
};