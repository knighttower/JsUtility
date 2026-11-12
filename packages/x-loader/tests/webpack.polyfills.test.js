// The webpack builds (dist/umd and dist/browser) must not add core-js polyfills.
// Babel's "usage" mode cannot tell String#includes from Array#includes, so it adds core-js's
// fix for a Safari Array#includes bug, which grows dist/browser/x-loader.js from about 6 KB
// to about 19 KB and, in that Safari, replaces Array#includes on the page that loads it.
import { test, expect } from 'vitest';
import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { transformSync } from '@babel/core';

const packageDir = fileURLToPath(new URL('..', import.meta.url));

// The shared webpack config reads source-files.cjs from the current directory,
// so it is loaded in a child process that starts in this package
const babelOptions = JSON.parse(
    execFileSync(
        process.execPath,
        [
            '-e',
            `const configs = require('../utility/nodeUtils/webpack.config.cjs');
            const options = configs.map(
                (config) => config.module.rules.find((rule) => rule.use?.loader === 'babel-loader').use.options
            );
            process.stdout.write(JSON.stringify(options));`,
        ],
        { cwd: packageDir, encoding: 'utf8' }
    )
);

test('the webpack builds add no core-js polyfills to the source files', () => {
    const sourceFiles = readdirSync(`${packageDir}src`, { recursive: true }).filter((file) =>
        file.endsWith('.js')
    );
    // Every target and format shares the same babel options, so check each distinct set once
    const distinctOptions = [...new Set(babelOptions.map((options) => JSON.stringify(options)))];

    expect(babelOptions.length).toBeGreaterThan(0);
    expect(sourceFiles.length).toBeGreaterThan(0);
    for (const options of distinctOptions) {
        for (const file of sourceFiles) {
            const filename = `${packageDir}src/${file}`;
            const { code } = transformSync(readFileSync(filename, 'utf8'), {
                ...JSON.parse(options),
                filename,
                cwd: packageDir,
                babelrc: false,
                configFile: false,
            });
            expect(code, file).not.toContain('core-js');
        }
    }
}, 60000);
