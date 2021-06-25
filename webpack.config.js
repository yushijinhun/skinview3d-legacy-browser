const path = require("path");
const ThreeMinifierPlugin = require("@yushijinhun/three-minifier-webpack");
const threeMinifier = new ThreeMinifierPlugin();

module.exports = {
	plugins: [ threeMinifier ],
	resolve: {
		plugins: [ threeMinifier.resolver ],
	},
	output: {
		filename: "index.js",
		environment: {
			arrowFunction: false,
			bigIntLiteral: false,
			const: false,
			destructuring: false,
			dynamicImport: false,
			forOf: false,
			module: false
		}
	},
	module: {
		rules: [{
			test: /\.jsx?$/,
			loader: "babel-loader",
			exclude: /node_modules\/(?!(three|skinview-utils|skinview3d)\/)/
		}]
	},
	devtool: "source-map",
	mode: "production"
};
