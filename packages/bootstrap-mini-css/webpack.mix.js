let mix = require('laravel-mix');
require('laravel-mix-compress');
const path = require('path');

mix.sass('src/bootstrapmini.scss', 'dist')
    .options({
        processCssUrls: false,
    })
    .compress({
        useBrotli: true,
    })
    .webpackConfig({
        // devtool: "source-map",
        resolve: {
            modules: ['node_modules'],
        },
        stats: 'errors-only',
    })
    .disableNotifications();
