var path = require('path');
var glob = require('glob');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var ExtractCSS = new ExtractTextPlugin('components.css');
var ExtractSASS = new ExtractTextPlugin('components.css');

var conf = {
	entry: './index',
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'components.js',
        libraryTarget: "var",
        library: "Components"
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: ExtractCSS.extract({
					use: [{
						loader: "css-loader",
						options: {
							minimize: true
						}
					}, {
						loader: 'postcss-loader',
						options: {
							plugins: [autoprefixer]
						}
					}],
					// use style-loader in development
					fallback: "style-loader"
				})
			}, {
				test: /\.s(c|a)ss$/,
				use: ExtractSASS.extract({
					use: [{
						loader: "css-loader",
						options: {
							minimize: true
						}
					}, {
						loader: 'postcss-loader',
						options: {
							plugins: [autoprefixer]
						}
					}, {
						loader: "sass-loader",
						options: {
							includePaths: [
								path.resolve(__dirname, 'src')
							]
						}
					}],
					// use style-loader in development
					fallback: "style-loader"
				})
			}, {
				test: /\.(woff|woff2|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				loader: 'url-loader?limit=2048&name=other/[name].[ext]'
			}, {
				test: /\.(png|gif|jpe?g)$/,
				loader: 'url-loader?limit=2048&name=img/[name].[ext]'
			}, {
				// 用于js引用html模板
				test: /\.html$/,
				loader: "html-loader?attrs=img:src img:data-src"
			},
			// {
			// 	// zepto引用特殊处理
			// 	test: require.resolve('zepto'),
			// 	use: 'imports-loader?this=>window'
			// }
		]
	},
	plugins: [
		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery',
			jquery: 'jquery',
			'window.jQuery': 'jquery',
			Vue: 'vue',
			echarts: 'echarts/lib/echarts'
		}),
		ExtractCSS,
		ExtractSASS,

		// new webpack.optimize.UglifyJsPlugin({
		// 	// include: [/vendor/],
		// 	compress: {
		// 		warnings: false
		// 	}
		// }),

		new webpack.LoaderOptionsPlugin({
			options: {
				htmlLoader: {
					root: path.resolve(__dirname, 'src'),
					removeComments: true
				}
			}
		}),

		// moment.js i18n 特殊处理
		new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-cn/)
	],
	resolve: {
		extensions: [".js"],
		alias: {
			'vue$': 'vue/dist/vue.common.js',
			'jquery-ui/ui/widget': 'blueimp-file-upload/js/vendor/jquery.ui.widget.js'
		}
    },
    externals: {
        'jquery': 'jQuery',
        'bootstrap': 'jQuery',
		'vue': 'Vue',
		// 'moment': 'moment',
		// 'daterangepicker': 'jQuery',
		// 'blueimp-file-upload': 'jQuery'
    }
};

module.exports = conf;