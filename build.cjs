const { runCommand } = require('./packages/utility/nodeUtils');
// const bumpVersion = require('@knighttower/js-utility-functions/nodeUtils/BumpVersion.cjs');
const workingDir = process.cwd();
const webpackConfig = `${workingDir}/packages/utility/nodeUtils/webpack.config.cjs`;
const rollupConfig = `${workingDir}/packages/utility/nodeUtils/rollup.config.cjs`;

// runCommand(`cd ./packages/type-check && npm run build`);

// runCommand('ncu -u && npm i');
// build TypeCheck
runCommand(
    `
cd ./packages/type-check \
&& npx webpack --mode production --config "${webpackConfig}" \
&& npx rollup -c "${rollupConfig}" \
&& node "${workingDir}/packages/utility/nodeUtils/BuildExports.js" --file ./dist/cjs/TypeCheck.cjs --type=cjs \
&& node "${workingDir}/packages/utility/nodeUtils/BuildExports.js" --file ./dist/esm/TypeCheck.js --type=esm \
&& node "${workingDir}/packages/utility/nodeUtils/BumpVersion.cjs" --exe \
&& eslint -c "${workingDir}/.eslintrc.json" --fix ./src --ext .js,.cjs,.mjs
&& prettier --config "${workingDir}/.prettierrc.json" --write ./index.js \
&& prettier --config "${workingDir}/.prettierrc.json" --write ./index.cjs
`,
);
// runCommand(`npx tsc -p "${workingDir}/tsconfig.json"`);
// runCommand(`npx rollup -c "${workingDir}/.build/rollup.config.cjs"`);
// runCommand(`npx webpack --config "${workingDir}/.build/webpack.config.cjs"`);
// runCommand(`node "${workingDir}/.build/minify.cjs"`);
// bumpVersion.exe();
