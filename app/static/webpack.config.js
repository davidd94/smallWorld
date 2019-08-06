const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;


const config = {
    entry: {
        reactHome: path.join(__dirname, 'reactJS/pages/homepages/index.jsx'),
        reactProfile: path.join(__dirname, 'reactJS/pages/profilepages/index.jsx')
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle-[name].js',
        publicPath: '/static/dist/',
    },
    resolve: {
        modules: [path.join(__dirname, 'node_modules')],
        extensions: ['.js', '.jsx', '.scss']
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
                    },
                }
            ]
        },
        {
            test: /\.css$/,
            loader: "style-loader!css-loader",
        },
        {
          test: /\.(png|svg|jpg|gif)$/,
          use: [{
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'images/',
              publicPath: '/static/dist/images',
              useRelativePaths: true
            }
          }]
        },
        {
            test: /\.module\.s(a|c)ss$/,
            include: path.join(__dirname, 'reactJS'),
            loader: [
              MiniCssExtractPlugin.loader,
              {
                loader: 'css-loader',
                options: {
                  modules: true,
                  sourceMap: true,
                  url: false,
                },
              },
              {
                loader: 'sass-loader',
                options: {
                  sourceMap: true
                }
              }
            ]
        },
        {
            test: /\.s(a|c)ss$/,
            exclude: /\.module.(s(a|c)ss)$/,
            loader: [
              MiniCssExtractPlugin.loader,
              'css-loader',
              {
                loader: 'sass-loader',
                options: {
                  sourceMap: true
                }
              }
            ]
        },
    ]},
    plugins: [
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: 'styles/[name].css',
            chunkFilename: 'styles/[id].css'
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
        }),
        //new BundleAnalyzerPlugin(),
    ],
};


module.exports = config;