import fs from 'fs';
import path from 'path';
import glob from 'glob';
import { PowerHelper as helper } from '../src/PowerHelpers.js';
import { Utility as utils } from '../src/Utility.js';
import { getFlagValue, runCommand, commandExistsSync } from './NodeHelpers.js';

const workingDir = process.cwd();
/**
 * Reads a file and returns the names of the exported modules.
 * @param {string} filePath
 * @returns {Object} Object containing arrays of named exports and the default export
 */
function getExports(filePath) {
    // get the whole file content
    const content = fs.readFileSync(filePath, 'utf-8');
    // Example matches: export const myVar, export function myFunc, export class MyClass
    // Example matches: export myVar, export myFunc
    const matchSingleExps = content.match(/export\s+(const|let|var|function|class)\s+(\w+)|export\s+(\w+)/g) || [];
    // Example matches: export default class MyClass, export default function myFunc,
    const matchDefClasses = content.match(/export\s+default\s+(class|function)\s*(\b(?!(\{|\())\w+\b)/) || [];
    // Example matches: export default Name, Name as default
    const matchDefSingles =
        content.match(
            /export\s+default\s+(\b(?!(\{|\(|(class|function)))\w+\b)|(?<=\{[^}]*)\w+\s+as\s+default(?=[^}]*\})/,
        ) || [];
    // Example matches: export { myVar, myFunc }
    const matchAliasesExps = content.match(/export\s*{([^}]+)}/g) || [];

    //Example matches: module.exports = { myVar, myFunc }
    const matchModuleExports = helper.getMatchInBetween(content, /module\.exports\s*={/g, '}', true);
    const matchModuleExports2 = helper.getMatchInBetween(content, /module\.exports\./g, /(=|;)/, true);
    const matchModuleExports3 = (content.match(/module\.exports\s*=\s*(\w+)/g) || []).map((module) =>
        helper.cleanStr(module, 'module.exports', '='),
    );

    //Example matches: modules.myModule = any
    const matchExports = (content.match(/modules\.(\w+)\s*=/g) || []).map((module) =>
        helper.cleanStr(module, 'modules.', '='),
    );
    const matchExports2 = (content.match(/(?!(\.))exports\.(\w+)\s*=/g) || []).map((module) =>
        helper.cleanStr(module, 'exports.', '='),
    );

    // Storages
    const singleExports = [];
    const defaultExport = utils.emptyOrValue(
        helper.cleanStr(
            matchDefClasses[0] || matchDefSingles[0] || '',
            'export',
            'default',
            'function',
            'class',
            /\bas\b/,
        ),
    );
    const aliasExports = [];
    let namedExports = [];

    // =========================================
    // --> Process the arrays to clean and pick the export
    // --------------------------
    // Handle single exports
    [...matchSingleExps, ...matchExports, ...matchExports2].forEach((exp) => {
        const parts = helper.cleanStr(exp, 'export').match(/\b\w+\b/g);
        if (parts.length === 1) {
            singleExports.push(parts[0]);
        } else if (parts.length === 2) {
            singleExports.push(parts[1]);
        }
    });

    // Handle aliases
    [...matchAliasesExps, ...matchModuleExports, ...matchModuleExports2, ...matchModuleExports3].forEach(
        (aliasLine) => {
            helper
                // cleanup and create an array of aliases
                .getChunks(helper.cleanStr(aliasLine, 'export', '{', '}'))
                // exclude default export
                .filter((chunk) => !chunk.includes('default'))
                // iterate to pick the correct alias;
                .forEach((chunk) => {
                    if (chunk.includes(' as ')) {
                        const alias = helper.getChunks(chunk, ' as ');
                        if (alias[1]) {
                            aliasExports.push(alias[1]);
                        }
                    } else {
                        aliasExports.push(chunk);
                    }
                });
        },
    );

    // Merge all named exports and filter
    namedExports = [...aliasExports, ...singleExports].filter((name) => name !== 'default' && name !== defaultExport);

    return {
        named: Array.from(new Set(namedExports)), // Remove duplicates
        default: defaultExport,
    };
}

/**
 * Generates the content for the index.js file.
 * @param {Object} allExports - An object containing information about all exports
 * @returns {string} - The content for the index.js file
 */
function getEsmContent(allExports) {
    let imports = '';
    let exports = [];

    for (const [filePath, { named, default: defaultExport }] of Object.entries(allExports)) {
        const moduleName = path.basename(filePath).replace(/\.js|\.mjs/, '');
        const relativePath = path.relative(workingDir, filePath).replace(/\\/g, '/');
        const commentSingle = `// Single Modules and Aliases from: ${moduleName}\n`;
        const commentDefault = `// Default Module from: ${moduleName}\n`;
        if (named.length > 0) {
            const namedModules = named.join(', ');

            imports += commentSingle;
            imports += `import { ${namedModules} } from './${relativePath}';\n`;
            exports.push(named);
        }

        if (defaultExport) {
            imports += commentDefault;
            imports += `import ${defaultExport} from './${relativePath}';\n`;
            exports.push(defaultExport);
        }
    }
    exports = exports.flat().join(',\n');

    return `${imports}\n export { \n ${exports} \n };`;
}

/**
 * Generate index content for CommonJS modules.
 * @param {Object} allExports - An object containing information about all exports.
 * @return {string} - The generated index content.
 */
function getCommonJsContent(allExports) {
    let imports = '';
    let exports = [];

    for (const [filePath, { named, default: defaultExport }] of Object.entries(allExports)) {
        const moduleName = path.basename(filePath).replace(/\.js|\.cjs/, '');
        const relativePath = path.relative(workingDir, filePath).replace(/\\/g, '/');
        const commentSingle = `// Single Modules and Aliases from: ${moduleName}\n`;
        const commentDefault = `// Default Module from: ${moduleName}\n`;

        if (named.length > 0) {
            const namedModules = named.join(', ');

            imports += commentSingle;
            imports += `const { ${namedModules} } = require('./${relativePath}');\n`;
            exports.push(named);
        }

        if (defaultExport) {
            imports += commentDefault;
            imports += `const ${defaultExport} = require('./${relativePath}');\n`;
            exports.push(defaultExport);
        }
    }
    exports = exports.flat().join(',\n');
    return `${imports}\n module.exports = { \n ${exports} \n };`;
}

/**
 * Main function to generate the index.js file.
 * @flags
 * -dir: The directory to search for modules. Defaults to './src'.
 * -type: The type of module to generate. Defaults to 'js'. Options: 'js', 'esm', 'cjs'.
 * -file: A single file to generate an index for. Defaults to false.
 * -out: The name of the output file. Defaults to 'index.js'.
 * @returns {void}
 */
(function generateIndex() {
    const dir = getFlagValue('dir') ?? './src';
    let type = getFlagValue('type') ?? 'js';
    type = ['js', 'esm', 'cjs'].includes(type) ? type : 'js';
    const ext = type === 'esm' ? 'js' : type;
    const singleFile = getFlagValue('file') ?? false;
    const out = getFlagValue('out') ? helper.cleanStr(getFlagValue('out'), '.js', '.mjs', '.cjs', '.ts') : null;
    const destination = out ? `${out}.${ext}` : `./index.${ext}`;
    // Synchronously fetch all file paths within a esmDir and its subdirectories
    // that have a .js or .mjs extension

    const processFiles = () => {
        const filePaths = !singleFile ? glob.sync(`${dir}/**/*.{js,mjs,cjs}`) : glob.sync(`${singleFile}`);
        const allExports = {};

        filePaths.forEach((filePath) => {
            if (!path.basename(filePath).includes('index')) {
                allExports[filePath] = getExports(filePath);
            }
        });

        const indexContent = type === 'cjs' ? getCommonJsContent(allExports) : getEsmContent(allExports);
        const indexPath = path.join(workingDir, destination);

        fs.writeFileSync(indexPath, indexContent);
        console.log(' Generated In:--->', indexPath);
        console.log('index generated');
        if (commandExistsSync('npx prettier')) {
            const exeCommand = `npx prettier --config .prettierrc.json --write "${indexPath}"`;
            runCommand(exeCommand);
        } else {
            console.log(
                'NPX or Prettier is not installed. Skipping formatting. If you want to format the files, please install prettier globally or locally.',
            );
        }
    };
    processFiles();
})();
