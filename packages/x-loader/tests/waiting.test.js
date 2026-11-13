// @vitest-environment jsdom
// ready() and when() are woken by events; their interval is only a backup.
// Fake timers: nothing here resolves by waiting for the interval unless a test says so.
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { xloader } from '../src/x-loader.js';

const script = (src) => document.querySelector(`script[src="${src}"]`);
// run every promise callback that is queued
const flush = async () => {
    for (let i = 0; i < 20; i++) await Promise.resolve();
};

beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'log').mockImplementation(() => {});
});
afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
});

describe('ready() for an ID that load() registers later', () => {
    test('resolves as soon as the load finishes, without waiting for the interval', async () => {
        const src = 'https://x.test/later.js';
        let done = false;
        xloader.loader.ready('later').then(() => (done = true));
        xloader.scripts.load(src, 'later');
        script(src).onload();

        await flush();
        expect(done).toBe(true);
        expect(vi.getTimerCount()).toBe(0);
    });

    test('after it times out (1 min), a later load() of that ID does not wake it again', async () => {
        let failed = false;
        xloader.loader.ready('never').catch(() => (failed = true));
        await vi.advanceTimersByTimeAsync(60 * 1000);
        expect(failed).toBe(true);
        expect(vi.getTimerCount()).toBe(0);

        xloader.scripts.load('https://x.test/never.js', 'never').catch(() => {});
        // a waiter left behind would start its 3 s load timeout here
        expect(vi.getTimerCount()).toBe(0);
    });
});

describe('when()', () => {
    test('resolves at once when the global is already in window', async () => {
        window.__xlAlready = {};
        let done = false;
        xloader.loader.when('__xlAlready').then(() => (done = true));

        await flush();
        expect(done).toBe(true);
        expect(vi.getTimerCount()).toBe(0);
    });

    test('resolves as soon as a script on the page finishes loading', async () => {
        let done = false;
        xloader.loader.when('__xlFromScript').then(() => (done = true));
        const el = document.createElement('script');
        document.head.appendChild(el);
        // a script sets its global when it runs, then fires load
        window.__xlFromScript = {};
        el.dispatchEvent(new Event('load'));

        await flush();
        expect(done).toBe(true);
        expect(vi.getTimerCount()).toBe(0);
    });

    test('still checks every 50 ms for a global set with no load event (inline script)', async () => {
        let done = false;
        xloader.loader.when('__xlInline').then(() => (done = true));
        window.__xlInline = {};

        await vi.advanceTimersByTimeAsync(50);
        expect(done).toBe(true);
        expect(vi.getTimerCount()).toBe(0);
    });

    test('after it times out, it stops listening', async () => {
        const remove = vi.spyOn(document, 'removeEventListener');
        let failed = false;
        xloader.loader.when('__xlNever', 200).catch(() => (failed = true));

        await vi.advanceTimersByTimeAsync(200);
        expect(failed).toBe(true);
        expect(vi.getTimerCount()).toBe(0);
        expect(remove).toHaveBeenCalledWith('load', expect.any(Function), true);
    });
});
