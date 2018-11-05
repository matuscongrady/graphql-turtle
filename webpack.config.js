const path = require('path');
const webpack = require('webpack');
const chalk = require('chalk');
const FriendlyErrors = require('friendly-errors-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const envConfig = require('./client/.env.js');

const isDev = process.env.NODE_ENV === 'development';
const port = process.env.PORT || 3000;

const config = {
  entry: isDev ? './client/index.tsx' : ['@babel/polyfill', './client/index.tsx'],
  mode: isDev ? 'development' : 'production',
  module: {
    rules: [
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto'
      },
      {
        test: /\.(mjs|ts|tsx)$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.graphql?$/,
        loader: 'webpack-graphql-loader'
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[hash].[ext]'
            }
          }
        ]
      }
    ]
  },
  stats: 'errors-only',
  output: {
    path: path.resolve(__dirname, './dist-client'),
    filename: isDev ? 'app.bundle.js' : 'app.bundle.[hash].js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.less'],
    alias: {
      '@reusable': path.resolve(__dirname, './client/components/_reusable'),
      '@components': path.resolve(__dirname, './client/components'),
      '@services': path.resolve(__dirname, './client/services'),
      '@static': path.resolve(__dirname, './client/static'),
      '@queries': path.resolve(__dirname, './client/queries'),
      '@utils': path.resolve(__dirname, './client/utils'),
      '@': path.resolve(__dirname, './client')
    }
  },
  devServer: {
    historyApiFallback: true,
    port,
    quiet: true,
    hot: true
  },
  performance: {
    hints: false
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.EnvironmentPlugin(envConfig),
    new HtmlWebpackPlugin({
      template: 'index.html',
      title: 'Graphql Turtle',
      inject: true
    })
  ]
};

if (isDev) {
  config.plugins = [
    ...config.plugins,
    new FriendlyErrors({
      compilationSuccessInfo: {
        messages: [
          `Application is running on ${chalk.bold.cyan(`http://localhost:${port}`)}`,
          ...Object.keys(envConfig).map(key => `${key}: ${chalk.bold.cyan(envConfig[key])}`)
        ]
      }
    })
  ];
} else {
  config.plugins = [
    ...config.plugins,
    new MiniCssExtractPlugin({
      filename: '[name].[hash].css',
      chunkFilename: '[id].[hash].css'
    }),
    new OptimizeCSSAssetsPlugin({}),
    new webpack.NoEmitOnErrorsPlugin(),
    new ProgressBarPlugin()
  ];
}

if (envConfig.APP_ENV === 'analyze') {
  config.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = config;
