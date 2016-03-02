module.exports = {
	module: {
		loaders: [{"test": /\.imba$/, "loader": __dirname + "/node_modules/imba/loader"}]
	},
	resolve: {extensions: ['', '.imba', '.js']},
	target: "web",
	entry: "./js/app.imba",
	output: { filename: "./js/bundle.js" }
}
