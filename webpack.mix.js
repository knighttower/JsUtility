const mix = require('laravel-mix');
const path = require('path');
const fs = require('fs');
require('laravel-mix-compress');

/**
 * Generates a Webpack configuration for a given library name and target.
 *
 * @param {string} libraryName - The name of the library.
 * @param {string} libraryTarget - The library target format.
 * @returns {Object} - The Webpack configuration.
 */
const getWebpackConfig = (libraryName, libraryTarget) => ({
    resolve: {
        modules: ['node_modules', path.resolve(__dirname, 'src')],
    },
    output: {
        library: libraryName,
        libraryTarget: libraryTarget,
    },

    stats: 'errors-only',
});

const targets = [
    { name: 'Utility', ext: '.js' },
    { name: 'DomObserver', ext: '.js' },
    { name: 'UrlHelper', ext: '.js' },
    { name: 'ElementHelper', ext: '.js' },
    { name: 'ProxyHelper', ext: '.js' },
    { name: 'PowerHelpers', ext: '.js' },
];

// Generate configurations for each target and format
targets.forEach((target) => {
    // UMD format for browsers
    mix.js(`src/${target.name}${target.ext}`, `dist/umd/${target.name}.js`).webpackConfig(
        getWebpackConfig(target.name, 'umd'),
    );

    // CommonJS format
    mix.js(`src/${target.name}${target.ext}`, `dist/cjs/${target.name}.js`).webpackConfig(
        getWebpackConfig(target.name, 'commonjs2'),
    );

    // CommonJS format
    mix.js(`src/${target.name}${target.ext}`, `dist/browser/${target.name}.js`).webpackConfig(
        getWebpackConfig(target.name, 'window'),
    );
});

// Additional settings for PowerHelpers
mix.setPublicPath('dist')
    .compress({
        useBrotli: true,
    })
    .disableNotifications();
