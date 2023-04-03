const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    "mode": "development",
    entry: './src/index.ts',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    "devtool": "source-map",
    "target": "web",
    plugins: [
        new CopyPlugin({
            patterns: [
                {from: "src", to: ""},
            ],
        }),
    ],
}


