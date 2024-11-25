const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin")

module.exports = {
    entry: "./src/index.js",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js",
        publicPath: "/NewsWeatherApp_new/",
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                },
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader", "postcss-loader"],
            },
            {
                test: /\.json$/,
                type: "asset/resource",
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf|svg)$/i,
                type: "asset/resource",
                generator: {
                    filename: "fonts/[name][ext][query]",
                },
            }
        ],
    },
    resolve: {
        extensions: [".js", ".jsx"],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./public/index.html",
            base: "/NewsWeatherApp_new/",
        }),
        new CopyWebpackPlugin({
            patterns: [{ from: "public/_redirects", to: "" }],
        }),
    ],
    devServer: {
        static: path.join(__dirname, "dist"),
        compress: true,
        port: 3000,
        open: true,
        hot: true,
    },
    mode: "development",
};