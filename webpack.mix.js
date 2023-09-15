const mix = require('laravel-mix');
const path = require('path');
const fs = require('fs');

mix.js('src/Utility.js', 'dist/Utility.js')
.setPublicPath('dist')
.webpackConfig({
    resolve: {
        modules: ['node_modules', path.resolve(__dirname, 'src')]
    },
    output: {
        library: 'Utility',
        libraryTarget: 'window',
    },
    stats: 'errors-only',
}).disableNotifications();
