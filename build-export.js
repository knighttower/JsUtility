const fs = require('fs');
const path = require('path');

/**
 * Reads a directory and returns an array of filenames.
 *
 * @param {string} directory - The path of the directory.
 * @returns {string[]} - An array of filenames.
 */
function readDirectory(directory) {
    return fs.readdirSync(directory).filter((file) => path.extname(file) === '.js');
}

/**
 * Reads a file and returns the names of the exported modules.
 *
 * @param {string} filePath - The path of the file to read.
 * @returns {string[]} - An array of exported module names.
 */
function getExports(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const exportMatches = content.match(/export\s+(const|let|var|function|class)\s+(\w+)/g) || [];
    return exportMatches.map((match) => match.split(' ').pop());
}

/**
 * Generates the content for index.js.
 *
 * @param {Object} exportMap - An object mapping filenames to exported module names.
 * @returns {string} - The content for index.js.
 */
function generateIndexContent(exportMap) {
    let content = '';
    for (const [file, exports] of Object.entries(exportMap)) {
        const moduleName = path.basename(file, '.js');
        content += `import * as ${moduleName} from './${moduleName}';\n`;
        exports.forEach((exp) => {
            content += `export const ${exp} = ${moduleName}.${exp};\n`;
        });
    }
    return content;
}

/**
 * Writes the given content to index.js.
 *
 * @param {string} content - The content for index.js.
 * @param {string} directory - The directory where index.js will be created.
 */
function writeIndexFile(content, directory) {
    const indexPath = path.join(directory, 'index.js');
    fs.writeFileSync(indexPath, content);
}

// Execution part
const directory = './src'; // Replace with your directory

const files = readDirectory(directory);
const exportMap = {};

files.forEach((file) => {
    const filePath = path.join(directory, file);
    exportMap[file] = getExports(filePath);
});

const indexContent = generateIndexContent(exportMap);
writeIndexFile(indexContent, directory);

console.log('Index.js generated successfully.');
