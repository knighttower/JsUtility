const targets = [
    { file: 'Utility.js', exportType: 'named' },
    { file: 'DomObserver.js', exportType: 'named' },
    { file: 'UrlHelper.js', exportType: 'named' },
    { file: 'ElementHelper.js', exportType: 'named' },
    { file: 'ProxyObject.js', exportType: 'named' },
    { file: 'ProxyClass.js', exportType: 'named' },
    { file: 'PowerHelpers.js', exportType: 'named' },
];

const rollupFormats = [
    { type: 'amd', ext: 'js' },
    { type: 'cjs', ext: 'cjs' },
    // { type: 'umd', ext: 'js' },
    { type: 'iife', ext: 'js' },
    { type: 'system', ext: 'js' },
    { type: 'esm', ext: 'mjs' },
];

const webpackFormats = [
    { type: 'umd', dir: 'umd', ext: 'js' },
    // { type: 'commonjs2', dir: 'cjs', ext: 'cjs' },
    { type: 'window', dir: 'browser', ext: 'js' },
];

module.exports = {
    targets,
    rollupFormats,
    webpackFormats,
};
