const fs = require('fs');
const path = require('path');
const { input, select, rawlist } = require('@inquirer/prompts');
const { runCommand, getFlagValue } = require('./packages/utility/nodeUtils/index.cjs');
const workingDir = process.cwd();
const webpackConfig = `${workingDir}/packages/utility/nodeUtils/webpack.config.cjs`;
const rollupConfig = `${workingDir}/packages/utility/nodeUtils/rollup.config.cjs`;
// const minify = `${workingDir}/packages/utility/nodeUtils/Minify.cjs`;

const once = getFlagValue('once') ? '' : '--watch';

// utility
const utility = () => {
    runCommand(
        `cd ./packages/utility \
        && npx webpack --config "${webpackConfig}" --mode=development ${once} --stats=minimal
        `
    );
};

// build TypeCheck
const typeCheck = () => {
    runCommand(
        `\
    cd ./packages/type-check \
    && npx webpack --config "${webpackConfig}" --mode=development ${once} --stats=minimal
    `
    );
};

const adaptive = () => {
    runCommand(
        `\
    cd ./packages/adaptive \
    && npx webpack --config "${webpackConfig}" --mode=development ${once} --stats=minimal
    `
    );
};

const blockui = () => {
    runCommand(
        `\
    cd ./packages/block-ui \
    && npx webpack --config "${webpackConfig}" --mode=development ${once} --stats=minimal
    `
    );
};

const toast = () => {
    runCommand(
        `\
    cd ./packages/toast \
    && npx webpack --config "${webpackConfig}" --mode=development ${once} --stats=minimal 
    `
    );
};

const xloader = () => {
    runCommand(
        `\
    cd ./packages/x-loader \
    && npx webpack --config "${webpackConfig}" --mode=development ${once} --stats=minimal 
    `
    );
};

// runCommand('ncu -u && npm i');

const workspaces = {
    'type-check': typeCheck,
    utility,
    adaptive,
    blockui,
    toast,
    xloader,
};

const choice = select({
    message: 'what to build',
    choices: Object.keys(workspaces).map((pkg) => {
        return {
            name: pkg,
            value: pkg,
        };
    }),
});

choice.then((choice) => {
    return workspaces[choice]();
});
