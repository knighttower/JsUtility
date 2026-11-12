import { test, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Checks that what gets published can be loaded: every file that package.json, index.js and index.cjs
// point to has to exist under that exact name and has to be part of the published files.

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

// Windows and macOS find 'utility.js' when the file is 'Utility.js', but Linux, npm and the CDNs do not,
// so every part of the path is looked up in the real listing of its folder
const existsWithExactCase = (file) => {
    let dir = root;
    for (const part of file.split('/')) {
        if (!fs.statSync(dir).isDirectory() || !fs.readdirSync(dir).includes(part)) {
            return false;
        }
        dir = path.join(dir, part);
    }
    return true;
};

// { 'dist/cjs/promises.cjs': 'exports["./promises"]', ... }
const getReferencedFiles = () => {
    const files = {};
    const add = (from, file) => {
        // 'dist/*' is checked as the folder 'dist'
        const clean = file.replace(/^\.\//, '').replace(/\/?\*.*$/, '');
        files[clean] = files[clean] ?? from;
    };

    ['main', 'module', 'browser', 'jsdelivr'].forEach((field) => add(field, pkg[field]));
    Object.entries(pkg.bin).forEach(([name, file]) => add(`bin.${name}`, file));
    Object.entries(pkg.exports).forEach(([name, target]) => {
        const targets = typeof target === 'string' ? [target] : Object.values(target);
        targets.forEach((file) => add(`exports["${name}"]`, file));
    });

    // What the two entry points load
    ['index.js', 'index.cjs'].forEach((entry) => {
        const code = fs.readFileSync(path.join(root, entry), 'utf8');
        for (const match of code.matchAll(/(?:from|require\()\s*['"](\.\/[^'"]+)['"]/g)) {
            add(entry, match[1]);
        }
    });

    return files;
};

const describeFiles = (files, names) => names.map((name) => `${files[name]} -> ${name}`);

test('every file the package points to exists under that exact name', () => {
    const files = getReferencedFiles();
    const missing = Object.keys(files).filter((file) => !existsWithExactCase(file));

    expect(Object.keys(files).length).toBeGreaterThan(10);
    expect(describeFiles(files, missing)).toEqual([]);
});

test('every file the package points to is published', () => {
    const files = getReferencedFiles();
    const isPublished = (file) =>
        pkg.files.some((entry) => file === entry || file.startsWith(`${entry}/`));
    const unpublished = Object.keys(files).filter((file) => !isPublished(file));

    expect(describeFiles(files, unpublished)).toEqual([]);
});
