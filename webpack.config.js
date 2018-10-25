const path = require('path');
const webpack = require('webpack');
const chalk = require('chalk');
const FriendlyErrors = require('friendly-errors-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const convert = require('koa-connect');
const history = require('connect-history-api-fallback');

const envConfig = require('./client/.env.js');
const isDev = process.env.NODE_ENV === 'development';
const port = process.env.PORT || 4000;

const config = {
	entry: isDev ? './client/index.tsx' : ['@babel/polyfill', './client/index.tsx'],
	mode: isDev ? 'development' : 'production',
	module: {
		rules: [
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: "javascript/auto",
      },
			{
				test: /\.(mjs|ts|tsx)$/,
				use: 'babel-loader',
				exclude: /node_modules/
			},
			{
				test: /\.css/,
				use: [
					isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: {
							sourceMap: isDev
						}
					}
				],
				include: /node_modules/
			},
			{
				test: /\.graphql?$/,
				loader: 'webpack-graphql-loader'
			},
			{
				test: /\.(woff2?|ttf|eot|otf)$/,
				loader: 'file-loader',
				options: {
					name: path => {
						if (!/node_modules|bower_components/.test(path)) return 'fonts/[name].[hash].[ext]';
						return (
							'fonts/vendor/' +
							path.replace(/\\/g, '/').replace(/((.*(node_modules|bower_components))|fonts|font|assets)\//g, '') +
							'?[hash]'
						);
					}
				}
			},
			{
				test: /\.(bmp|png|jpe?g|gif|svg|ico|ani|cur)$/,
				loaders: [
					{
						loader: 'file-loader',
						options: {
							name: path => {
								if (!/node_modules|bower_components/.test(path)) return 'images/[name].[hash].[ext]';
								return (
									'images/vendor/' +
									path
										.replace(/\\/g, '/')
										.replace(/((.*(node_modules|bower_components))|images|image|img|assets)\//g, '') +
									'?[hash]'
								);
							}
						}
					},
					'img-loader'
				]
			}
		]
	},
	stats: 'errors-only',
	devtool: isDev ? 'inline-source-map' : 'source-map',
	output: {
		path: path.resolve(__dirname, './dist-client'),
		filename: isDev ? 'app.bundle.js' : 'app.bundle.[hash].js',
		publicPath: '/'
	},
	resolve: {
		extensions: ['.js', '.jsx', '.ts', '.tsx', '.less'],
		alias: {
			'@nx-js/observer-util': '@nx-js/observer-util/dist/es.es6.js',
			'@reusable': path.resolve(__dirname, './client/components/_reusable'),
			'@components': path.resolve(__dirname, './client/components'),
			'@services': path.resolve(__dirname, './client/services'),
			'@static': path.resolve(__dirname, './client/static'),
			'@store': path.resolve(__dirname, './client/store.ts'),
			'@utils': path.resolve(__dirname, './client/utils'),
			'@pages': path.resolve(__dirname, './client/pages'),
			'@': path.resolve(__dirname, './client'),
			'react-easy-state': 'react-easy-state/dist/es.es6.js'
		}
	},
	serve: {
		add: app => {
			app.use(convert(history()));
		}
	},
	performance: {
		hints: false
	},
	plugins: [
		new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en/),
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
