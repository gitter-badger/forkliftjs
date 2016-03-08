module.exports = function (config) {
  config.set({
    // base path used to resolve all patterns
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai'],

    // list of files/patterns to load in the browser
    files: [{ pattern: 'spec.bundle.js', watched: false }],

    // files to exclude
    exclude: [],

    plugins: [
      require('karma-chai'),
      require('karma-chrome-launcher'),
      require('karma-mocha'),
      require('karma-mocha-reporter'),
      require('karma-sourcemap-loader'),
      require('karma-webpack')
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: { 'spec.bundle.js': ['webpack', 'sourcemap'] },

    webpack: {
      devtool: 'inline-source-map',
      module: {
        // FIXME: Loader redundancy
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
            loader: ['style', 'css?sourceMap']
          },

          // Compile and load SASS/SCSS as CSS.
          {
            test: /\.s(c|a)ss$/,
            loaders: ['style', 'css', 'sass']
          },

          // Compile and load LESS as CSS.
          {
            test: /\.less$/,
            loaders: ['style', 'css', 'less']
          },

          // Compile and load Stylus as CSS.
          {
            test: /\.styl$/,
            loaders: ['style', 'css', 'stylus']
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
    },

    webpackServer: {
      noInfo: true // prevent console spamming when running in Karma!
    },

    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['mocha'],

    // web server port
    port: 9876,

    // enable colors in the output
    colors: true,

    // level of logging
    // possible values:
    // config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN
    // || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // toggle whether to watch files and rerun tests upon incurring changes
    autoWatch: false,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],

    // if true, Karma runs tests once and exits
    singleRun: true
  });
};