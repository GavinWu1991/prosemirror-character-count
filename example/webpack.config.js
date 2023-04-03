const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    "mode": "development",
    "entry": __dirname + "/src/index.js",
    "output": {
        "path": __dirname + '/dist/',
        filename: "index.js"
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
