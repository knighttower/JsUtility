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
mix.js('src/DomObserver.js', 'dist/DomObserver.js').webpackConfig(getWebpackConfig('DomObserver'));
mix.js('src/UrlHelper.js', 'dist/UrlHelper.js').webpackConfig(getWebpackConfig('UrlHelper'));
mix.js('src/ElementHelper.js', 'dist/ElementHelper.js').webpackConfig(getWebpackConfig('ElementHelper'));
mix.js('src/ProxyHelper.js', 'dist/ProxyHelper.js').webpackConfig(getWebpackConfig('ProxyHelper'));

// Configure for PowerHelpers.js
mix.js('src/PowerHelpers.js', 'dist/PowerHelpers.js')
    .setPublicPath('dist')
    .compress({
        useBrotli: true,
    })
    .webpackConfig(getWebpackConfig('PowerHelpers'))
    .disableNotifications();
