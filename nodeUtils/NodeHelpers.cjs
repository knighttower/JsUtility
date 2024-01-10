// include esm object to allow for es6 import/export syntax
Object.defineProperty(exports, '__esModule', { value: true });

const { execSync } = require('child_process');
const { removeQuotes } = require('../dist/cjs/PowerHelpers.cjs');
const { isEmpty } = require('../dist/cjs/Utility.cjs');
const fs = require('fs');
const path = require('path');

/**
 * Get the value of a command line flag.
 *
 * @param {string} flagName - The name of the flag to look for.
 * @returns {string|bool} The value of the flag if found, or null if not found.
 */
exports.getFlagValue = (flagName) => {
    let argValue = null;
    // allow only string values
    if (typeof flagName !== 'string') {
        return null;
    }

    const args = process.argv.slice(2); // Remove the first two elements (Node executable and script filename)
    for (const prefix of ['--', '-']) {
        const flag = `${prefix}${flagName}`;

        args.every((arg, index) => {
            if (arg.startsWith(flag)) {
                if (arg.includes('=')) {
                    argValue = arg.split('=')[1];
                    return false;
                } else {
                    const nextVal = args[index + 1];
                    if (nextVal && !nextVal.startsWith('-') && !nextVal.startsWith('--')) {
                        argValue = nextVal;
                        return false;
                    } else {
                        // return true since it can be just a flag
                        argValue = true;
                        return false;
                    }
                }
            }
            return true;
        });
    }
    argValue = isEmpty(argValue) ? null : removeQuotes(argValue);
    return argValue;
};

/**
 * Function to run shell command and return its output
 * @param {string} command - The shell command to run
 * @param {string} stdio - The stdio setting ('inherit' or 'pipe')
 * @returns {string|boolean} - The stdout as a string or boolean indicating success/failure
 */
exports.runCommand = (command, returnOutput = false) => {
    try {
        const options = { encoding: 'utf8', stdio: 'inherit' };
        if (returnOutput) {
            options.stdio = 'pipe';
        }

        const stdout = execSync(command, options);
        return stdout;
    } catch (error) {
        console.log(`Error executing command: ${command}`, error);
        return false;
    }
};

/**
 * Recursively get all files with specified extensions from a directory.
 * @param {string} dirPath - The directory to search in.
 * @param {string[]} extensions - Array of extensions to include in the result.
 * @param {string[]} files - Accumulator for files found.
 * @returns {string[]} Array of file paths.
 */

exports.getAllFiles = function (dirPath, extensions = ['.js', '.mjs', '.cjs'], files = []) {
    const filesInDirectory = fs.readdirSync(dirPath);

    for (const file of filesInDirectory) {
        const filePath = path.join(dirPath, file);
        if (fs.statSync(filePath).isDirectory()) {
            exports.getAllFiles(filePath, extensions, files);
        } else if (extensions.includes(path.extname(file))) {
            files.push(filePath);
        }
    }

    return files;
};
