const path = require('path');
const CompressionPlugin = require('compression-webpack-plugin');
/**
 * Generates a Webpack configuration for a given library name and target.
 *
 * @param {string} libraryName - The name of the library.
 * @param {string} libraryTarget - The library target format.
 * @returns {Object} - The Webpack configuration.
 */
const getWebpackConfig = (libraryName, libraryTarget, dir, ext) => ({
    mode: 'production',
    entry: `./src/${libraryName}.${ext}`,
    output: {
        path: path.resolve(__dirname, `dist/${dir}`),
        filename: `${libraryName}.js`,
        library: libraryName,
        libraryTarget: libraryTarget,
        umdNamedDefine: true,
    },
    stats: {
        errorDetails: true, // or 'auto'
    },
    plugins: [
        new CompressionPlugin({
            algorithm: 'brotliCompress',
            test: /\.js$/,
            compressionOptions: { level: 11 },
            threshold: 10240,
            minRatio: 0.8,
            deleteOriginalAssets: false,
        }),
    ],
});

const targets = [
    { name: 'Utility', ext: 'mjs' },
    { name: 'DomObserver', ext: 'mjs' },
    { name: 'UrlHelper', ext: 'mjs' },
    { name: 'ElementHelper', ext: 'mjs' },
    { name: 'ProxyHelper', ext: 'mjs' },
    { name: 'PowerHelpers', ext: 'mjs' },
];

// Generate multiple configurations
const configs = targets.flatMap((target) => [
    getWebpackConfig(target.name, 'umd', 'umd', target.ext),
    getWebpackConfig(target.name, 'commonjs2', 'cjs', target.ext),
    getWebpackConfig(target.name, 'window', 'browser', target.ext),
]);

module.exports = configs;
