const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

module.exports = {
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /(node_modules|browser_components)/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },

  resolve: {
    root: [path.resolve('./src')],
    extensions: ['', '.ts', '.tsx', '.png', '.svg', '.scss'],
    plugins: [new TsconfigPathsPlugin({})]
  }
}
