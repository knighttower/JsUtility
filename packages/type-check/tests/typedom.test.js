import { test, vi, expect } from 'vitest';
import assert from 'assert';
import { JSDOM } from 'jsdom';
// import { typeCheck } from '../dist/umd/typeCheck.js';

vi.setConfig({
    testTimeout: 50000,
});
test('object on window', async () => {
    const dom = new JSDOM('<!DOCTYPE html><p>Hello world</p>', {
        runScripts: 'dangerously',
        resources: 'usable',
        // beforeParse(window) {
        //     window.typeCheck = typeCheck;
        // },
    });

    await new Promise((resolve) => setTimeout(resolve, 300)); // Simple delay to wait for scripts
    // console.log('______log______', dom.window.typeCheck);

    // expect(dom.window.typeCheck).toBeTypeOf('function');
    // expect(dom.window.typeCheck('string', 'string')).toBeTypeOf('object');
});
