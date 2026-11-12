const targets = [
    { file: 'Adaptive.js', exportType: 'named' },
    { file: 'Teleport.js', exportType: 'named' },
];

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

// Build dist/umd and dist/browser without core-js polyfills. Babel's "usage" mode cannot tell
// String#includes from Array#includes, so it adds core-js's fix for a Safari Array#includes
// bug (about 13 KB), and in that Safari the fix replaces Array#includes on the host page.
// The browsers the build targets already have everything Adaptive uses.
const polyfills = false;

module.exports = {
    targets,
    rollupFormats,
    webpackFormats,
    polyfills,
};
