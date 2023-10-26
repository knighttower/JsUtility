const path = require('path');
const workingDir = process.cwd();
const { targets } = require(`${workingDir}/source-files.cjs`);

/**
 * Generates a Webpack configuration for a given library name and target.
 *
 * @param {string} libraryName - The name of the library.
 * @param {string} libraryTarget - The library target format.
 * @returns {Object} - The Webpack configuration.
 */
const getWebpackConfig = (libraryName, libraryTarget, dir, ext) => ({
    mode: 'production',
    entry: `${workingDir}/src/${libraryName}.${ext}`,
    resolve: {
        modules: [
            'node_modules',
            path.resolve(__dirname, 'src'),
            path.resolve(__dirname, `${workingDir}/src`),
            path.resolve(__dirname, `${workingDir}/node_modules`),
        ],
        extensions: ['.mjs', '.js', '.json', '.cjs'],
    },
    output: {
        path: path.resolve(__dirname, `${workingDir}/dist/${dir}`),
        filename: `${libraryName}.js`,
        library: libraryName,
        libraryTarget: libraryTarget,
        umdNamedDefine: true,
    },
    stats: 'errors-only',
});

// Generate multiple configurations
const configs = targets.flatMap((target) => [
    // getWebpackConfig(target.name, 'umd', 'umd', target.ext),
    // getWebpackConfig(target.name, 'commonjs2', 'cjs', target.ext),
    getWebpackConfig(target.name, 'window', 'browser', target.ext),
]);

module.exports = configs;
