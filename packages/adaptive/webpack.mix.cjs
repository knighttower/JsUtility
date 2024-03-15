const mix = require('laravel-mix');
const path = require('path');
const fs = require('fs');

mix.js('examples/vue/app.js', 'examples/vue/app.min.js').vue();
mix.js('examples/react/app.js', 'examples/react/app.min.js').react();
mix.js('src/Adaptive.js', 'dist/browser/Adaptive.js');

mix.webpackConfig({
    externals: {
        vue: 'Vue',
        react: 'React',
        'react-dom': 'ReactDOM',
    },
    resolve: {
        modules: ['node_modules', path.resolve(__dirname, 'src')],
    },
    stats: 'errors-only',
}).disableNotifications();
