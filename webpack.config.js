var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  entry: "./index.js",
  output: {
    filename: "bundle.js",
    path: __dirname + "/build",
    publicPath: "build/"
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: [
          require.resolve('./lib/webpack') + "?compress",  // use 'react-style/lib/webpack' instead
          require.resolve('jsx-loader')      // use 'jsx-loader' instead
        ]
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract("style-loader", "css-loader")
      },
      {
        test: /\.png$/,
        loader: "file-loader"
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin("styles.css")
  ]
  // this is needed only for the current example, remove lines below if you reuse
  // this configuration in your own application
  // resolve: {
  //   alias: {
  //     'react-style': path.join(__dirname, '../'),
  //     'react': path.join(__dirname, 'node_modules', 'react')
  //   }
  // }
};
