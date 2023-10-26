import fs from 'fs';
import path from 'path';
import glob from 'glob';
import { minify } from 'terser';
const workingDir = process.cwd();

function getFilesToMinify() {
    const directory = workingDir + '/dist';
    const filePaths = glob.sync(`${directory}/**/*.{js,mjs,cjs}` || []);
    const allExports = [];

    filePaths.forEach((filePath) => {
        const moduleName = path.basename(filePath).replace(/\.js|\.mjs|\.cjs/, '');
        allExports.push({
            input: directory + `/${moduleName}.js`,
            output: directory + '/${moduleName}.min.js',
            options: {
                compress: true,
                mangle: true,
            },
        });
    });

    return allExports;
}

async function minifyFile(input, output, options) {
    try {
        const inputCode = await fs.readFile(input, 'utf8');
        const result = await minify(inputCode, options);
        if (result.error) {
            console.error(`Error minifying ${input}: ${result.error}`);
            return;
        }
        await fs.writeFile(output, result.code, 'utf8');
        console.log(`Minified ${input} to ${output}`);
    } catch (err) {
        console.error(`Failed to minify ${input}: ${err}`);
    }
}

async function main() {
    for (const { input, output, options } of getFilesToMinify()) {
        await minifyFile(input, output, options);
    }
}

main().catch((err) => {
    console.error('Minification failed:', err);
});
