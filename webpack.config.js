// For info about this file refer to webpack and webpack-hot-middleware documentation
// Rather than having hard coded webpack.config.js for each environment, this
// file generates a webpack config for the environment passed to the getConfig method.
import webpack from 'webpack';
import path from 'path';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

const developmentEnvironment = 'development' ;
const productionEnvironment = 'production';
const testEnvironment = 'test';

const getPlugins = function (env) {
	const GLOBALS = {
		'process.env.NODE_ENV': JSON.stringify(env),
		__DEV__: env === developmentEnvironment
	};

	const plugins = [
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.DefinePlugin(GLOBALS) //Tells React to build in prod mode. https://facebook.github.io/react/downloads.html
	];

	switch (env) {
		case productionEnvironment:
			plugins.push(new ExtractTextPlugin('styles.css'));
			plugins.push(new webpack.optimize.DedupePlugin());
			plugins.push(new webpack.optimize.UglifyJsPlugin({minimize: true}));
			break;

		case developmentEnvironment:
			plugins.push(new webpack.HotModuleReplacementPlugin());
			plugins.push(new webpack.NoErrorsPlugin());
			break;
	}

	return plugins;
};

const getEntry = function (env) {
	const entry = [];

	if (env === developmentEnvironment ) { // only want hot reloading when in dev.
		entry.push('webpack-hot-middleware/client?reload=true');
	}

	if (env === productionEnvironment ) { 
		//entry.push('./src/components/LineChart.js');
		entry.push('./src/main');
	} else {
		//entry.push('./src/index');
		entry.push('./example/index');
	}

	return entry;
};

const getLoaders = function (env) {
	const loaders = [
		{ test: /\.js$/, include: path.join(__dirname, 'src'), loaders: ['babel', 'eslint'] },
		{ test: /\.js$/, include: path.join(__dirname, 'example'), loaders: ['babel', 'eslint'] },
		{ test: /\.(jpe?g|png|gif|svg)$/i, loaders: ['file'] }
	];

	if (env === productionEnvironment ) {
		// generate separate physical stylesheet for production build using ExtractTextPlugin. This provides separate caching and avoids a flash of unstyled content on load.
		loaders.push({test: /(\.css|\.scss)$/, loader: ExtractTextPlugin.extract("css?sourceMap!sass?sourceMap")});
	} else {
		loaders.push({test: /(\.css|\.scss)$/, loaders: ['style', 'css?sourceMap', 'sass?sourceMap']});
	}

	return loaders;
};

function getConfig(env) {
	return {
		debug: true,
		devtool: env === productionEnvironment  ? 'source-map' : 'cheap-module-eval-source-map', // more info:https://webpack.github.io/docs/build-performance.html#sourcemaps and https://webpack.github.io/docs/configuration.html#devtool
		noInfo: true, // set to false to see a list of every file being bundled.
		entry: getEntry(env),
		target: env === testEnvironment ? 'node' : 'web', // necessary per https://webpack.github.io/docs/testing.html#compile-and-test
		externals: [
			{
				react: {
					root: 'React',
					commonjs2: 'react',
					commonjs: 'react',
					amd: 'react'
				},
				'react-dom': 'ReactDOM'
			}
		],
		output: {
			path: __dirname + '/dist', // Note: Physical files are only output by the production build task `npm run build`.
			publicPath: '/',
			filename: 'bundle.js',			
			libraryTarget: 'umd'			
		},
		plugins: getPlugins(env),
		module: {
			loaders: getLoaders(env)
		}		
	};
}

export default getConfig;