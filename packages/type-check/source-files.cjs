const targets = [{ file: 'typeCheck.js', exportType: 'named', windowExport: 'typeCheck' }];

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
// fix for a Safari Array#includes bug to every file that calls .includes, on a string or an array:
// about 13 KB, 61% of each file. The bug needs a start index on a sparse array, and no
// Array#includes call here or in the utility code it bundles passes one.
const polyfills = false;

module.exports = {
    targets,
    rollupFormats,
    webpackFormats,
    polyfills,
};
