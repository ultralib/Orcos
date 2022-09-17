const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = {
    entry: { 
        main: "./src/js/index.js"
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "orcos.[chunkhash].js",
    },
    devServer: {
        compress: true,
        port: 9000
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ['@babel/preset-env']
                    }
                },
            },
            {
              test: /\.css$/i,
              use: ["style-loader", "css-loader"],
            },
            {
                test: /\.(?:scss|sass)$/,
                exclude: /node_modules/,
                use: [ 
                    "style-loader",
                    "css-loader",
                    "sass-loader"
                ],
            },
            {
                test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
                exclude: /node_modules/,
                type: 'asset/resource',
            },
            {
                test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
                exclude: /node_modules/,
                type: 'asset/inline',
            },
        ],
    },
    plugins: [
        new MonacoWebpackPlugin(),
        new HtmlWebpackPlugin({
            inject: false,
            hash: true,
            template: "./src/index.html",
            filename: "index.html",
        }),
        new MiniCssExtractPlugin({
            filename: 'orcos.css',
            chunkFilename: '[id].css'
        }),
        new CleanWebpackPlugin(),
    ]
}