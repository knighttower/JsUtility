const fs = require('fs');
const path = require('path');
const { input, select, rawlist } = require('@inquirer/prompts');
const { runCommand, readJson, writeJson } = require('./packages/utility/nodeUtils');
const workingDir = process.cwd();
const webpackConfig = `${workingDir}/packages/utility/nodeUtils/webpack.config.cjs`;
const rollupConfig = `${workingDir}/packages/utility/nodeUtils/rollup.config.cjs`;
const minify = `${workingDir}/packages/utility/nodeUtils/Minify.js`;
const buildExports = `${workingDir}/packages/utility/nodeUtils/BuildExports.js`;
const bumpVersion = `${workingDir}/packages/utility/nodeUtils/BumpVersion.cjs`;
const pretty = `${workingDir}/.prettierrc.json`;
const eslint = `${workingDir}/.eslintrc.js`;

function getSubfolders(dirPath) {
    return fs
        .readdirSync(dirPath, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name);
}

// Event Bus
const eventBus = () => {
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
};

// Utility
const utility = () => {
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
};

// build TypeCheck
const typeCheck = () => {
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
};

runCommand('ncu -u && npm i');
let workspaces = getSubfolders(`${workingDir}/packages`);

const answer = select({
    message: 'what to build',
    choices: [
        ...workspaces.map((pkg) => {
            return {
                name: pkg,
                value: pkg,
            };
        }),
        ...[
            {
                name: 'all',
                value: 'all',
            },
        ],
    ],
});

answer.then((answer) => {
    if (answer === 'event-bus') {
        eventBus();
    } else if (answer === 'utility') {
        utility();
    } else if (answer === 'type-check') {
        typeCheck();
    } else if (answer === 'all') {
        eventBus();
        utility();
        typeCheck();
    }
    // Bump the MonoRepo version
    runCommand(`node "${bumpVersion}" --exe`);
});
