const fs = require('fs');
const path = require('path');
const { input, select, confirm } = require('@inquirer/prompts');
const { runCommand, getFlagValue } = require('./packages/utility/nodeUtils');
const workingDir = process.cwd();
const webpackConfig = `${workingDir}/packages/utility/nodeUtils/webpack.config.cjs`;
const rollupConfig = `${workingDir}/packages/utility/nodeUtils/rollup.config.cjs`;
const buildExports = `${workingDir}/packages/utility/nodeUtils/BuildExports.cjs`;
const bumpVersion = `${workingDir}/packages/utility/nodeUtils/BumpVersion.cjs`;
const pretty = `${workingDir}/.prettierrc.json`;
const eslint = `${workingDir}/eslint.config.cjs`;
const minify = `${workingDir}/packages/utility/nodeUtils/minify.cjs`;

const local = getFlagValue('local');
const pkgOnly = getFlagValue('pkg');

// utility
const utility = () => {
    const commands = [
        'cd ./packages/utility',
        `eslint -c "${eslint}" --fix ./src`,
        `npx webpack --mode production --config "${webpackConfig}"`,
        `npx rollup -c "${rollupConfig}"`,
        `node "${buildExports}" --dir ./dist/cjs --type=cjs`,
        `node "${buildExports}" --dir ./src --type=esm`,
        `prettier --config "${pretty}" --write ./index.js`,
        `prettier --config "${pretty}" --write ./index.cjs`,
        'npx vitest run',
        `node "${bumpVersion}" --exe --minor`,
        local ? '' : 'npm publish --access public',
    ]
        .filter(Boolean)
        .join(' && ');

    runCommand(commands);
};

// build TypeCheck
const typeCheck = () => {
    const commands = [
        'cd ./packages/type-check',

        `eslint -c "${eslint}" --fix ./src`,
        `npx webpack --mode production --config "${webpackConfig}"`,
        `npx rollup -c "${rollupConfig}"`,
        `node "${buildExports}" --file ./dist/cjs/typeCheck.cjs --type=cjs`,
        `node "${buildExports}" --file ./src/typeCheck.js --type=esm`,
        `prettier --config "${pretty}" --write ./index.js`,
        `prettier --config "${pretty}" --write ./index.cjs`,
        'npx vitest run',
        `node "${bumpVersion}" --exe --minor`,
        local ? '' : 'npm publish --access public',
    ]
        .filter(Boolean)
        .join(' && ');

    runCommand(commands);
};

const adaptive = () => {
    runCommand(
        `\
    cd ./packages/adaptive \
    && eslint -c "${eslint}" --fix ./src \
    && npx webpack --mode production --config "${webpackConfig}" \
    && npx rollup -c "${rollupConfig}" \
    && prettier --config "${pretty}" --write ./index.js \
    && prettier --config "${pretty}" --write ./index.cjs \
    && node "${buildExports}" --dir ./dist/cjs --type=cjs \
    && node "${buildExports}" --dir ./dist/esm --type=esm \
    && node "${bumpVersion}" --exe --minor \
    ` + (local ? '' : '&& npm publish --access public')
    );
};

const mono = () => {
    runCommand(
        `\
    node ./add-exports.cjs && node "${bumpVersion}" --exe --minor \
    ` + (local ? '' : '&& npm publish --access public')
    );
};

const vueUtils = () => {
    runCommand(
        `\
    cd ./packages/vue-utils \
    && eslint -c "${eslint}" --fix ./src \
    && npx webpack --mode production --config "${webpackConfig}" \
    && npx rollup -c "${rollupConfig}" \
    && node "${buildExports}" --dir ./dist/cjs --type=cjs \
    && node "${buildExports}" --dir ./src --type=esm \
    && prettier --config "${pretty}" --write ./index.js \
    && prettier --config "${pretty}" --write ./index.cjs \
    && node "${bumpVersion}" --exe \
    ` + (local ? '' : '&& npm publish --access public')
    );
};

const generic = (genDir) => {
    runCommand(
        `\
    cd ./packages/${genDir} \
    && eslint -c "${eslint}" --fix ./src \
    && npx webpack --mode production --config "${webpackConfig}" \
    && npx rollup -c "${rollupConfig}" \
    && node "${bumpVersion}" --exe --minor \
    ` + (local ? '' : '&& npm publish --access public')
    );
};

const workspaces = {
    'type-check': typeCheck,
    utility,
    adaptive,
    'vue-utils': vueUtils,
    mono,
    'block-ui': () => generic('block-ui'),
    toast: () => generic('toast'),
    xloader: () => generic('x-loader'),
    all: () => {
        typeCheck();
        utility();
        adaptive();
        vueUtils();
        mono();
        generic('block-ui');
        generic('toast');
        generic('x-loader');
    },
};

const doUpdate = confirm({ message: 'Update?' });

doUpdate.then((doUpdate) => {
    if (doUpdate) {
        runCommand('ncu --interactive && npm i');
    }
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
        let errorFound = false;
        try {
            workspaces[choice]();
        } catch (error) {
            errorFound = true;
        }

        if (!errorFound && choice !== 'mono' && !pkgOnly) {
            workspaces['mono']();
        }
        return;
    });
});
