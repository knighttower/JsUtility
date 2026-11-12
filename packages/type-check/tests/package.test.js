// What the npm package ships: every file that package.json, index.js and index.cjs point at must
// exist with exactly that name (Linux and the npm CDNs are case-sensitive, Windows and macOS are not)
// and be inside "files".
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const clean = (file) => path.posix.normalize(file.replace(/^\.\//, ''));

// fs.existsSync ignores case on Windows and macOS, readdirSync returns the real names
const existsExact = (file) => {
    let dir = root;
    for (const part of clean(file).split('/')) {
        if (!fs.existsSync(dir) || !fs.readdirSync(dir).includes(part)) {
            return false;
        }
        dir = path.join(dir, part);
    }
    return true;
};

// npm always packs package.json, README, LICENSE and "main", everything else must be in "files"
const isPacked = (file) => {
    const name = clean(file);
    return (
        name === clean(pkg.main) ||
        pkg.files.some((entry) => name === entry || name.startsWith(`${entry}/`))
    );
};

// The entry points, and the relative imports they load (the dist bundles are self-contained)
const referenced = new Set();
const follow = (file) => {
    const name = clean(file);
    if (referenced.has(name)) {
        return;
    }
    referenced.add(name);
    if (name.startsWith('dist/') || !existsExact(name)) {
        return;
    }
    const code = fs.readFileSync(path.join(root, name), 'utf8');
    for (const [, spec] of code.matchAll(/(?:from|require\()\s*['"](\.{1,2}\/[^'"]+)['"]/g)) {
        follow(path.posix.join(path.posix.dirname(name), spec));
    }
};
[
    pkg.main,
    pkg.module,
    pkg.browser,
    pkg.unpkg,
    pkg.jsdelivr,
    pkg.exports['.'].import,
    pkg.exports['.'].require,
]
    .filter(Boolean)
    .forEach(follow);

// CDN links in the README, e.g. https://cdn.jsdelivr.net/npm/@knighttower/type-check@latest/dist/browser/typeCheck.js
const readme = fs.readFileSync(path.join(root, 'README.md'), 'utf8');
const readmeLinks = [...readme.matchAll(/@knighttower\/type-check@[^/\s]+\/([^\s"'<>)]+)/g)].map(
    (match) => match[1]
);

describe('published entry points', () => {
    it.each([...referenced])('%s exists with this exact name', (file) => {
        expect(existsExact(file)).toBe(true);
    });

    it.each([...referenced])('%s is in the npm package', (file) => {
        expect(isPacked(file)).toBe(true);
    });
});

describe('README CDN links', () => {
    it.each(readmeLinks)('%s exists with this exact name', (file) => {
        expect(existsExact(file)).toBe(true);
    });
});

describe('side effects', () => {
    it('lets bundlers drop an unused import, but keeps the browser build that sets window.typeCheck', () => {
        expect(pkg.sideEffects).toEqual(['./dist/browser/*']);
    });
});
