const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const htmlPlugin = new HtmlWebPackPlugin({
    template: './src/index.html',
    filename: './index.html'
});

module.exports = {
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.svg$/,
                use: '@svgr/webpack'
            },
            {
                test: /\.html$/i,
                use: 'html-loader'
            }
        ]
    },
    plugins: [htmlPlugin],
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'docs')
    }
};