import { test, vi, expect } from 'vitest';
import assert from 'assert';
import { JSDOM } from 'jsdom';
// The names are written exactly as the files are on disk, Linux does not ignore upper and lower case
import urlHelper from '../dist/umd/UrlHelper.js';
import utility from '../dist/umd/Utility.js';
import proxyObject from '../dist/umd/ProxyObject.js';
vi.setConfig({
    testTimeout: 50000,
});
test('urlHelper is present and is an object on window', async () => {
    const dom = new JSDOM('<!DOCTYPE html><p>Hello world</p>', {
        runScripts: 'dangerously',
        resources: 'usable',
        // documentRoot: __dirname + '../dist/browser/',
        // scripts: ['urlHelper.js'],
        // url: '/',
        beforeParse(window) {
            window.utility = utility;
            window.urlHelper = urlHelper;
            window.proxyObject = proxyObject;
        },
    });

    await new Promise((resolve) => setTimeout(resolve, 300)); // Simple delay to wait for scripts
    // Assume urlHelper library script is added to the DOM
    // dom.window.eval('window.urlHelper;');
    // dom.window.eval('window.utility;');
    console.log('______log______', dom.window.urlHelper);
    console.log('______log______', dom.window.utility);
    console.log('______log______', dom.window.proxyObject);

    expect(dom.window.urlHelper).toBeTypeOf('function');
    expect(dom.window.urlHelper()).toBeTypeOf('object');
    assert(dom.window.urlHelper() !== null && typeof dom.window.urlHelper() === 'object');
    expect(dom.window.utility).toBeTypeOf('object');
    expect(dom.window.proxyObject).toBeTypeOf('function');
});
