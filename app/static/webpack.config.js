const webpack = require('webpack');
const path = require('path');
var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");

const config = {
    entry: { privacy: (__dirname + '/reactJS/privacy-index.jsx'),
             subscription: (__dirname + '/reactJS/subscription-index.jsx')
    },
    output: {
        path: path.join(__dirname, '/dist'),
        filename: '[name].entry.chunk.js',
    },
    plugins: [
		new CommonsChunkPlugin("commons")
	],
    resolve: {
        modules: [path.join(__dirname, 'node_modules')],
        extensions: ['.js', '.jsx', '.css']
    },
    resolveLoader: {
        modules: [path.join(__dirname, 'node_modules')]
    },
    module: {
        rules: [
        {
            test: /\.jsx?/,
            exclude: /node_modules/,
            use: [
                {
                loader: 'babel-loader',
                options: {
                    presets: ["@babel/preset-react"]
                    }
                }
            ]
        }]
    },
};
module.exports = config;