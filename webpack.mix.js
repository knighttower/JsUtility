const mix = require('laravel-mix');
const path = require('path');
const fs = require('fs');
require('laravel-mix-compress');

const getWebpackConfig = (libraryName) => ({
    resolve: {
        modules: ['node_modules', path.resolve(__dirname, 'src')],
    },
    output: {
        library: libraryName,
        libraryTarget: 'window',
    },
    stats: 'errors-only',
});

// Configure for Utility.js
mix.js('src/Utility.js', 'dist/Utility.js').webpackConfig(getWebpackConfig('Utility'));

// Configure for PowerHelpers.js
mix.js('src/PowerHelpers.js', 'dist/PowerHelpers.js')
    .setPublicPath('dist')
    .compress({
        useBrotli: true,
    })
    .webpackConfig(getWebpackConfig('PowerHelpers'))
    .disableNotifications();
