/* eslint-disable no-var, vars-on-top */
var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var forkliftConfig = require('./config');
var paths = forkliftConfig.paths;
var projectConfig = require('./index').projectConfig;

// Paths
var sourcePath = paths.source;
var vendorPath = paths.vendor;
var bowerPath = paths.bower; // eslint-disable-line no-unused-vars
var distPath = paths.dist;

var config = {
  eslint: {
    configFile: path.join(paths.forklift, '.eslintrc')
  },

  // Entrypoints (Usually one single entrypoint).
  entry: [

    // Main module.
    path.join(sourcePath, 'main')
  ],

  output: {
    // Outputs bundles and index.html to the `dist` folder.
    path: distPath,

    // Output bundle filename.
    filename: '[name].bundle.js'
  },

  resolve: {
    // Enable loading modules relatively (without the ../../ prefix).
    root: sourcePath,

    // Add aliases for (bower) modules here.
    // NOTE: IT IS PREFERABLE TO USE NPM OVER BOWER AND ALWAYS USE UNMINIFIED
    //       FILES!
    alias: projectConfig.vendorAliases.map(function(vendorAlias) {
      return path.resolve(sourcepath, vendorAlias);
    }),
    // alias: {
    //   // EXAMPLE:
    //   //   jquery: path.join(bowerPath, 'jquery', 'dist', 'jquery.js'),
    //   //   bootstrapStyles: path.join(bowerPath, 'bootstrap', 'dist', 'css', 'bootstrap.css'),
    //   //
    //   // BEFORE ALIAS:
    //   //   import $ from './vendor/bower/jquery/dist/jquery.js';
    //   //
    //   // AFTER ALIAS:
    //   //   import $ from 'jquery';
    // },

    // Locate modules in these directories.
    // In order to import without specifying the module's path.
    modulesDirectories: [
      'node_modules',
      'web_modules',
      vendorPath,
      bowerPath
    ]
  },

  plugins: [
    // Reference: http://webpack.github.io/docs/list-of-plugins.html#noerrorsplugin
    // Only emit files when there are no errors.
    new webpack.NoErrorsPlugin(),

    // Reference: http://webpack.github.io/docs/list-of-plugins.html#dedupeplugin
    // Dedupe modules in the output.
    new webpack.optimize.DedupePlugin(),

    // Optimise module location in module collection for commonly used modules.
    new webpack.optimize.OccurrenceOrderPlugin(),

    // Injects bundles in your index.html instead of wiring all manually.
    // It also adds hash to all injected assets so we don't have problems
    // with cache purging during deployment.
    new HtmlWebpackPlugin({
      template: path.join(sourcePath, 'index.html'),
      inject: 'body',
      hash: true
    }),

    // Automatically move all modules defined outside of application directory to vendor bundle.
    // If you are using more complicated project structure, consider to specify
    // common chunks manually.
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module, count) { // eslint-disable-line babel/object-shorthand, no-unused-vars, object-shorthand, max-len
        return module.resource && module.resource.indexOf(path.resolve(__dirname, 'src')) === -1;
      }
    }),

    // Extract all stylesheets to their own bundle called styles.css.
    new ExtractTextPlugin('styles.bundle.css')
  ],

  module: {

    preLoaders: [
      // Lint scripts using ESLint.
      {
        test: /\.(js|jsx|es6)$/,
        loaders: ['eslint'],
        exclude: /(node_modules|vendor|bower)/
      }
    ],

    loaders: [
      // Load and compile JavaScript.
      {
        test: /\.(js|jsx|es6)$/,
        exclude: /(node_modules|vendor|bower)/,
        loader: 'babel'
      },

      // Load CSS.
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style', 'css?sourceMap')
      },

      // Compile and load SASS/SCSS as CSS.
      {
        test: /\.s(c|a)ss$/,
        loaders: ExtractTextPlugin.extract('style', 'css', 'sass')
      },

      // Compile and load LESS as CSS.
      {
        test: /\.less$/,
        loaders: ExtractTextPlugin.extract('style', 'css', 'less')
      },

      // Compile and load Stylus as CSS.
      {
        test: /\.styl$/,
        loaders: ExtractTextPlugin.extract('style', 'css', 'stylus')
      },

      // Load HTML files.
      {
        test: /\.html$/,
        loaders: ['html']
      },

      // Load JSON files.
      {
        test: /\.json$/,
        loaders: ['json']
      },

      // Load images (inline base64 URLs for files <= 8kb).
      {
        test: /\.(png|jpeg|jpg|gif)$/,
        loaders: ['url?limit=8192']
      },

      // Load webfonts.
      {
        test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
        loaders: ['file']
      }
    ]
  }
};

module.exports = config;
/* eslint-enable no-var, vars-on-top */
