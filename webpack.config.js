const path = require("path");
const ThreeMinifierPlugin = require("@yushijinhun/three-minifier-webpack");
const threeMinifier = new ThreeMinifierPlugin();

module.exports = {
	plugins: [ threeMinifier ],
	resolve: {
		plugins: [ threeMinifier.resolver ],
	},
	output: {
		filename: "index.js"
	},
	module: {
		rules: [{
			test: /\.jsx?$/,
			loader: "babel-loader",
			exclude: {
				test: path.resolve(__dirname, "node_modules"),
				exclude: [
					path.resolve(__dirname, "node_modules/three"),
					path.resolve(__dirname, "node_modules/skinview-utils"),
					path.resolve(__dirname, "node_modules/skinview3d")
				]
			}
		}]
	},
	devtool: "source-map",
	mode: "production"
};
