const targets = [{ file: 'x-loader.js', exportType: 'named' }];

const rollupFormats = [
    // { type: 'amd', ext: 'js' },
    { type: 'cjs', ext: 'cjs' },
    // { type: 'umd', ext: 'js' },
    // { type: 'iife', ext: 'js' },
    // { type: 'system', ext: 'js' },
    { type: 'esm', ext: 'js' },
];

const webpackFormats = [
    { type: 'umd', dir: 'umd', ext: 'js' },
    // { type: 'commonjs2', dir: 'cjs', ext: 'cjs' },
    { type: 'window', dir: 'browser', ext: 'js' },
];

// Build dist/umd and dist/browser without core-js polyfills. Babel's "usage" mode adds core-js's
// fix for a Safari Array#includes bug to every file that calls .includes: about 13 KB, which
// takes dist/browser/x-loader.js from 6 KB to 19 KB. The bug needs a start index on a sparse
// array, and neither Array#includes call in x-loader passes one.
const polyfills = false;

module.exports = {
    targets,
    rollupFormats,
    webpackFormats,
    polyfills,
};
