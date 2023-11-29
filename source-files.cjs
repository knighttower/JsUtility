const targets = [
    { file: 'Utility.js', exportType: 'named' },
    { file: 'DomObserver.js', exportType: 'default' },
    { file: 'UrlHelper.js', exportType: 'default' },
    { file: 'ElementHelper.js', exportType: 'default' },
    { file: 'ProxyHelper.js', exportType: 'default' },
    { file: 'PowerHelpers.js', exportType: 'named' },
];

const rollupFormats = [
    { type: 'amd', ext: 'js' },
    // { type: 'cjs', ext: 'cjs' },
    // { type: 'umd', ext: 'js' },
    { type: 'iife', ext: 'js' },
    { type: 'system', ext: 'js' },
    { type: 'esm', ext: 'mjs' },
];

const webpackFormats = [
    { type: 'umd', dir: 'umd', ext: 'js' },
    { type: 'commonjs2', dir: 'cjs', ext: 'cjs' },
    { type: 'window', dir: 'browser', ext: 'js' },
];

module.exports = {
    targets,
    rollupFormats,
    webpackFormats,
};
