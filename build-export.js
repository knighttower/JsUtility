const fs = require('fs');
const path = require('path');
const glob = require('glob');

/**
 * Reads a file and returns the names of the exported modules.
 * @param {string} filePath
 * @returns {Object} Object containing arrays of named exports and the default export
 */
function getExports(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const directExports =
        content.match(/export\s+(const|let|var|function|class)\s+(\w+)|export\s+(\w+)|export\s*{([^}]+)}/g) || [];
    const defaultExport = content.match(/export\s+default\s+(class|function)?\s*(\w+)|(\w+)\s+as\s+default/);
    const aliases = content.match(/export\s*{([^}]+)}/g) || [];

    let namedExports = [];

    directExports.forEach((exp) => {
        const parts = exp.replace('export ', '').split(' ');
        if (parts.length === 1) {
            namedExports.push(parts[0]);
        } else if (parts.length === 2) {
            namedExports.push(parts[1]);
        } else {
            const innerExports = parts[2].slice(1, -1).split(',');
            innerExports.forEach((e) => {
                const [original, alias] = e.trim().split(' as ');
                namedExports.push(alias || original);
            });
        }
    });

    let defaultExportName = null;

    if (defaultExport) {
        defaultExportName = defaultExport[2] || defaultExport[3];
    }

    // Adding aliases
    aliases.forEach((aliasLine) => {
        const parts = aliasLine.replace('export {', '').replace('}', '').split(',');
        parts.forEach((part) => {
            const [original, alias] = part.trim().split(' as ');
            if (alias && alias !== 'default') {
                namedExports.push(alias);
            }
        });
    });

    // Remove 'default' from named exports
    namedExports = namedExports.filter((name) => name !== 'default' && name !== defaultExportName);

    return {
        named: Array.from(new Set(namedExports)), // Remove duplicates
        default: defaultExportName,
    };
}

/**
 * Generates the content for the index.js file.
 * @param {Object} allExports - An object containing information about all exports
 * @returns {string} - The content for the index.js file
 */
function generateIndexContent(allExports) {
    let imports = '';
    let exports = '';

    for (const [filePath, { named, default: defaultExport }] of Object.entries(allExports)) {
        const moduleName = path.basename(filePath, '.js');
        const relativePath = path.relative(process.cwd(), filePath).replace(/\\/g, '/').replace(/\.js$/, '');

        if (named.length > 0) {
            imports += `import * as _${moduleName} from './${relativePath}';\n`;
            named.forEach((name) => {
                if (name) {
                    exports += `export const ${name} = _${moduleName}.${name};\n`;
                }
            });
        }

        if (defaultExport) {
            imports += `import ${defaultExport} from './${relativePath}';\n`;
            exports += `export { ${defaultExport} };\n`;
        }
    }

    return `${imports}\n${exports}`;
}

/**
 * Main function to generate the index.js file.
 */
function generateIndex() {
    const directory = process.argv.includes('--directory')
        ? process.argv[process.argv.indexOf('--directory') + 1]
        : '.';
    const filePaths = glob.sync(`${directory}/**/*.js`);

    const allExports = {};

    filePaths.forEach((filePath) => {
        if (path.basename(filePath) === 'index.js') {
            return;
        }
        allExports[filePath] = getExports(filePath);
    });

    const indexContent = generateIndexContent(allExports);
    fs.writeFileSync(path.join(process.cwd(), 'index.js'), indexContent);
    console.log('index.js generated');
}

generateIndex();
