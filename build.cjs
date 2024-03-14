const { runCommand } = require('./packages/utility/nodeUtils');

const workingDir = process.cwd();
const webpackConfig = `${workingDir}/packages/utility/nodeUtils/webpack.config.cjs`;
const rollupConfig = `${workingDir}/packages/utility/nodeUtils/rollup.config.cjs`;
const minify = `${workingDir}/packages/utility/nodeUtils/Minify.js`;
const buildExports = `${workingDir}/packages/utility/nodeUtils/BuildExports.js`;
const bumpVersion = `${workingDir}/packages/utility/nodeUtils/BumpVersion.cjs`;
const pretty = `${workingDir}/.prettierrc.json`;
const eslint = `${workingDir}/.eslintrc.js`;

runCommand('ncu -u && npm i');

// Event Bus
runCommand(
    `\
    cd ./packages/event-bus \
    && npx tsc -p "${workingDir}/packages/event-bus/tsconfig.json" \
    && npx rollup -c "${rollupConfig}" \
    && npx webpack --config "${webpackConfig}" \
    && node "${minify}" \
    && node "${bumpVersion}" --exe \
    && npm publish --access public
    `
);

// Utility
runCommand(
    `cd ./packages/utility \
    && eslint -c "${eslint}" --fix ./src --ext .js,.cjs,.mjs \
    && npx webpack --mode production --config "${webpackConfig}" \
    && npx rollup -c "${rollupConfig}" \
    && node "${buildExports}" --dir ./dist/cjs --type=cjs \
    && node "${buildExports}" --dir ./dist/esm --type=esm \
    && prettier --config "${pretty}" --write ./index.js \
    && prettier --config "${pretty}" --write ./index.cjs \
    && node "${bumpVersion}" --exe \
    && npm publish --access public
    `
);

// build TypeCheck
runCommand(
    `\
    cd ./packages/type-check \
    && eslint -c "${eslint}" --fix ./src --ext .js,.cjs,.mjs \
    && npx webpack --mode production --config "${webpackConfig}" \
    && npx rollup -c "${rollupConfig}" \
    && node "${buildExports}" --file ./dist/cjs/TypeCheck.cjs --type=cjs \
    && node "${buildExports}" --file ./dist/esm/TypeCheck.mjs --type=esm \
    && prettier --config "${pretty}" --write ./index.js \
    && prettier --config "${pretty}" --write ./index.cjs \
    && node "${bumpVersion}" --exe \
    && npm publish --access public
    `
);

// Bump the MonoRepo version
runCommand(`node "${bumpVersion}" --exe`);
