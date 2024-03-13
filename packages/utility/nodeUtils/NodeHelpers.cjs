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
 * @usage
 * const flagValue = getFlagValue('flagName'); // catches --flagName=value or --flagName value or -flagName=value or -flagName value
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
 * @param {boolean} [returnOutput=false] - Whether to return the output of the command. Defaults to false.
 * @returns {string|boolean} - The stdout as a string or boolean indicating success/failure
 * @usage
 * const output = runCommand('ls -la', true); // returns the output of the command
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
 * Function to check if npm script exists
 * @param {string} scriptName - The npm script name to check
 * @returns {boolean} - True if script exists, otherwise false
 * @usage
 * const exists = checkNpmScript('test');
 */
exports.checkNpmScript = (scriptName) => {
    const npmScripts = exports.runCommand('npm run-script', true);
    return npmScripts ? npmScripts.includes(scriptName) : false;
};

/**
 * Tests if a given command exists in the system synchronously.
 * @param {string} command - The command to check.
 * @returns {boolean} - Returns true if the command exists, false otherwise.
 * @usage
 * const exists = commandExistsSync('node');
console.log(`Does node command exist? ${exists}`);
 */
exports.commandExistsSync = (command) => {
    try {
        execSync(`${command} --version`, { stdio: 'ignore' });
        return true;
    } catch (error) {
        return false;
    }
};

/**
 * Recursively get all files with specified extensions from a directory.
 * @param {string} dirPath - The directory to search in.
 * @param {string[]} extensions - Array of extensions to include in the result.
 * @param {string[]} files - Accumulator for files found.
 * @returns {string[]} Array of file paths.
 * @usage
 * const files = getAllFilesByExtension('src', ['.js', '.mjs', '.cjs']);
 */

exports.getAllFilesByExtension = function (dirPath, extensions = ['.js', '.mjs', '.cjs'], files = []) {
    const filesInDirectory = fs.readdirSync(dirPath);

    for (const file of filesInDirectory) {
        const filePath = path.join(dirPath, file);
        if (fs.statSync(filePath).isDirectory()) {
            exports.getAllFilesByExtension(filePath, extensions, files);
        } else if (extensions.includes(path.extname(file))) {
            files.push(filePath);
        }
    }

    return files;
};

/**
 * Recursively searches for a file by name in the given directory and its subdirectories.
 * @param {string} fileName - The name of the file to find.
 * @param {string} [dirPath=process.cwd()] - The directory path to start the search in.
 * @returns {string|null} The path of the found file, or null if not found.
 */
exports.getFileByName = function (fileName, dirPath = process.cwd()) {
    const filesInDirectory = fs.readdirSync(dirPath);

    for (const file of filesInDirectory) {
        const filePath = path.join(dirPath, file);
        if (fs.statSync(filePath).isDirectory()) {
            const found = exports.getFileByName(fileName, filePath);
            if (found) {
                return found;
            }
        } else if (file === fileName) {
            return filePath;
        }
    }

    return null;
};

/**
 * Recursively searches for all files matching the specified names in the given directory and its subdirectories.
 * @param {string} dirPath - The directory path to start the search in.
 * @param {string[]} [fileNames=['index.js']] - An array of file names to search for.
 * @param {string[]} [files=[]] - Accumulator array for found file paths.
 * @returns {string[]} An array of paths for the found files.
 */
exports.getAllFilesByName = function (fileNames = ['index.js'], dirPath = process.cwd(), files = []) {
    const filesInDirectory = fs.readdirSync(dirPath);

    for (const file of filesInDirectory) {
        const filePath = path.join(dirPath, file);
        if (fs.statSync(filePath).isDirectory()) {
            exports.getAllFilesByName(filePath, fileNames, files);
        } else if (fileNames.includes(file)) {
            files.push(filePath);
        }
    }

    return files;
};
