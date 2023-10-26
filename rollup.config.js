import buble from '@rollup/plugin-buble';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';

const targets = [
    { name: 'Utility', ext: 'js', exportType: 'named' },
    { name: 'DomObserver', ext: 'js', exportType: 'default' },
    { name: 'UrlHelper', ext: 'js', exportType: 'default' },
    { name: 'ElementHelper', ext: 'js', exportType: 'default' },
    { name: 'ProxyHelper', ext: 'js', exportType: 'default' },
    { name: 'PowerHelpers', ext: 'js', exportType: 'named' },
];

const formats = ['amd', 'cjs', 'umd', 'iife', 'system', 'esm'];

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
        input: `./src/${filename}`,
        output: {
            name: 'adaptive',
            format,
            file: `./dist/${format}/${filename}`,
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

export default configs;
