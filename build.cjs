const { runCommand } = require('./packages/utility/nodeUtils');

const workingDir = process.cwd();
const webpackConfig = `${workingDir}/packages/utility/nodeUtils/webpack.config.cjs`;
const rollupConfig = `${workingDir}/packages/utility/nodeUtils/rollup.config.cjs`;
const minify = `${workingDir}/packages/utility/nodeUtils/Minify.js`;
const buildExports = `${workingDir}/packages/utility/nodeUtils/BuildExports.js`;
const bumpVersion = `${workingDir}/packages/utility/nodeUtils/BumpVersion.cjs`;
const pretty = `${workingDir}/.prettierrc.json`;
const eslint = `${workingDir}/.eslintrc.json`;

// runCommand(`cd ./packages/type-check && npm run build`);

// runCommand('ncu -u && npm i');
// Event Bus
// runCommand(
//     `\
//     cd ./packages/event-bus \
//     && npx tsc -p "${workingDir}/packages/event-bus/tsconfig.json" \
//     && npx rollup -c "${rollupConfig}" \
//     && npx webpack --config "${webpackConfig}" \
//     && node "${minify}"
//     `
// );

runCommand(
    `cd ./packages/utility \
    && npx webpack --mode production --config "${webpackConfig}" \
    && npx rollup -c "${rollupConfig}" \
    && node "${buildExports}" --dir ./dist/cjs --type=cjs
    `
);

// build TypeCheck
// const typeCheckBuild = runCommand(
//     `\
//     cd ./packages/type-check \
//     && npx webpack --mode production --config "${webpackConfig}" \
//     && npx rollup -c "${rollupConfig}" \
//     `
// );

// runCommand(`npx tsc -p "${workingDir}/tsconfig.json"`);
// runCommand(`npx rollup -c "${workingDir}/.build/rollup.config.cjs"`);
// runCommand(`npx webpack --config "${workingDir}/.build/webpack.config.cjs"`);
// runCommand(`node "${workingDir}/.build/minify.cjs"`);
// bumpVersion.exe();

// && node "${buildExports}" --file ./dist/cjs/TypeCheck.cjs --type=cjs \
// && node "${buildExports}" --file ./dist/esm/TypeCheck.js --type=esm \
// && node "${bumpVersion}" --exe \
// && eslint -c "${eslint}" --fix ./src --ext .js,.cjs,.mjs \
// && prettier --config "${pretty}" --write ./index.js \
// && prettier --config "${pretty}" --write ./index.cjs\
