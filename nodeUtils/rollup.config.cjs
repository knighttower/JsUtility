const buble = require('@rollup/plugin-buble');
const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const babel = require('@rollup/plugin-babel');
const path = require('path');

const workingDir = process.cwd();
const { targets, rollupFormats } = require(`${workingDir}/source-files.cjs`);

const formats = rollupFormats ?? [('amd', 'cjs', 'umd', 'iife', 'system', 'esm')];

function buildConfig({ filename, format, transpile = true, exportType = 'default' }) {
    const plugins = [
        resolve(),
        commonjs(),
        babel({
            presets: ['@babel/preset-env'],
            babelHelpers: 'bundled',
        }),
    ];
    if (transpile) {
        plugins.push(buble());
    }

    return {
        input: path.resolve(`${workingDir}/src/${filename}`),
        output: {
            name: 'adaptive',
            format,
            file: path.resolve(`${workingDir}/dist/${format}/${filename}`),
            exports: exportType,
        },
        plugins,
    };
}

function getAllConfigs() {
    const configs = [];
    targets.forEach((target) => {
        // Generate multiple configurations
        for (const format of formats) {
            configs.push(
                buildConfig({ filename: `${target.name}.${target.ext}`, format, exportType: target.exportType }),
            );
        }
    });
    return configs;
}

const configs = getAllConfigs();

module.exports = configs;
