module.exports = {
    entry: "./src/app.ts",
    output: {
        filename: "./js/bundle.js"
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    // Enable inline mode for dev server automatic refresh
    devServer: {
        inline: true
    },

    resolve: {
        // Add resolvable extensions.
        extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx",".js"]
    },

    module: {
        loaders: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
            { test: /\.tsx?$/, loader: "ts-loader" }
        ],

        preLoaders: [
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { test: /\.js$/, loader: "source-map-loader" }
        ]
    }
};