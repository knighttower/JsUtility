const { runCommand } = require('./packages/utility');
// const bumpVersion = require('@knighttower/js-utility-functions/nodeUtils/BumpVersion.cjs');
const workingDir = process.cwd();
const webpackConfig = `${workingDir}/packages/utility/webpack.config.cjs`;
const rollupConfig = `${workingDir}/packages/utility/rollup.config.cjs`;

runCommand(`cd ./packages/type-check && npm run build`);

// build TypeCheck
runCommand(`\
cd ./packages/type-check \
&& npx webpack --mode production --config ${webpackConfig} --workingDir=${workingDir} \
`);
// runCommand(`npx tsc -p "${workingDir}/tsconfig.json"`);
// runCommand(`npx rollup -c "${workingDir}/.build/rollup.config.cjs"`);
// runCommand(`npx webpack --config "${workingDir}/.build/webpack.config.cjs"`);
// runCommand(`node "${workingDir}/.build/minify.cjs"`);
// bumpVersion.exe();
