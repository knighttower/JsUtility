const targets = [
    { name: 'Utility', ext: 'js', exportType: 'named' },
    { name: 'DomObserver', ext: 'js', exportType: 'default' },
    { name: 'UrlHelper', ext: 'js', exportType: 'default' },
    { name: 'ElementHelper', ext: 'js', exportType: 'default' },
    { name: 'ProxyHelper', ext: 'js', exportType: 'default' },
    { name: 'PowerHelpers', ext: 'js', exportType: 'named' },
];

const rollupFormats = ['amd', 'cjs', 'umd', 'iife', 'system', 'esm'];
const webpackFormats = [
    { name: 'umd', dir: 'umd' },
    { name: 'commonjs2', dir: 'cjs' },
    { name: 'window', dir: 'browser' },
];

module.exports = {
    targets,
    rollupFormats,
    webpackFormats,
};
