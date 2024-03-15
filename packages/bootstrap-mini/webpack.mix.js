let mix = require('laravel-mix');
require('laravel-mix-compress');
const path = require('path');
const workingDir = process.cwd();

mix.sass('src/bootstrap-mini.scss', 'dist')
    .options({
        processCssUrls: false,
    })
    .compress({
        useBrotli: true,
    })
    .webpackConfig({
        // devtool: "source-map",
        resolve: {
            modules: [
                'node_modules',
                path.resolve(__dirname, `${workingDir}/node_modules`),
                path.resolve(__dirname, '../../node_modules'),
                path.resolve(__dirname, '../../../node_modules'),
            ],
            alias: {
                // Alias for easier imports from src and parent node_modules
                '~': path.resolve(__dirname, 'src'),
                node_modules: path.resolve(__dirname, '../../node_modules'),
            },
        },
        stats: 'errors-only',
    })
    .disableNotifications();
