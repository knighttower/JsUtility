const buble = require('@rollup/plugin-buble');
const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const babel = require('@rollup/plugin-babel');
const path = require('path');

const workingDir = process.cwd();
const { targets, rollupFormats } = require(`${workingDir}/source-files.cjs`);

const formats = rollupFormats ?? [
    { type: 'amd', ext: 'js' },
    { type: 'cjs', ext: 'cjs' },
    { type: 'umd', ext: 'js' },
    { type: 'iife', ext: 'js' },
    { type: 'system', ext: 'js' },
    { type: 'esm', ext: 'mjs' },
];

function buildConfig({ file, format, transpile = true, exportType = 'default', exportExt = 'js' }) {
    const fileName = file.split('.')[0];
    const fileOutput = `${fileName}.${exportExt}`;
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
        input: path.resolve(`${workingDir}/src/${file}`),
        output: {
            name: fileName,
            format,
            file: path.resolve(`${workingDir}/dist/${format}/${fileOutput}`),
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
                buildConfig({
                    file: target.file,
                    format: format.type,
                    exportType: target.exportType,
                    exportExt: format.ext,
                }),
            );
        }
    });
    return configs;
}

const configs = getAllConfigs();

module.exports = configs;
