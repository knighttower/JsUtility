// @vitest-environment jsdom
// Bugs fixed in November 2026: each test failed before its fix.
// jsdom does not download scripts or images, so the tests call each element's
// onload / onerror handler themselves.
import { describe, test, expect, vi, beforeEach, afterEach, beforeAll, afterAll } from 'vitest';
import { xloader, domTracking } from '../src/x-loader.js';

const settle = (ms = 20) => new Promise((resolve) => setTimeout(resolve, ms));
const script = (src) => document.querySelector(`script[src="${src}"]`);

// Images are created with `new Image()`, which never enters the DOM until it has loaded
const images = [];
const stubImage = (onSrc) => {
    vi.stubGlobal('Image', function () {
        const img = document.createElement('img');
        if (onSrc) {
            Object.defineProperty(img, 'src', {
                configurable: true,
                get: () => img.getAttribute('src'),
                set: (value) => {
                    onSrc(img);
                    img.setAttribute('src', value);
                },
            });
        }
        images.push(img);
        return img;
    });
};

const unhandled = [];
const onUnhandled = (reason) => unhandled.push(reason);
beforeAll(() => process.on('unhandledRejection', onUnhandled));
afterAll(() => process.off('unhandledRejection', onUnhandled));

beforeEach(() => {
    unhandled.length = 0;
    images.length = 0;
    // The library logs every failure, keep the test output clean
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'log').mockImplementation(() => {});
});
afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
});

test('the jsdom document is ready, so isReady callbacks run at once', () => {
    expect(domTracking.isLoaded).toBe(true);
});

describe('loading the library twice (for example dist/browser plus the npm import)', () => {
    test('the second copy does not throw and shares the first one', async () => {
        vi.resetModules();
        const second = await import('../src/x-loader.js');
        expect(second.xloader).toBe(xloader);
        expect(second.domTracking).toBe(domTracking);
    });
});

describe('scripts.load() called before <body> exists (from a script in <head>)', () => {
    test('the script is added to <head> instead of failing', async () => {
        const src = 'https://x.test/no-body.js';
        const body = document.body;
        body.remove();
        const loading = xloader.scripts.load(src, 'no-body');
        loading.catch(() => {});
        document.documentElement.appendChild(body);

        expect(document.head.contains(script(src))).toBe(true);
        script(src).onload();
        await expect(loading).resolves.toEqual([src]);
    });
});

describe('load() with an ID that is already registered', () => {
    test('waits for the first load instead of resolving at once', async () => {
        const src = 'https://x.test/dup.js';
        const first = xloader.scripts.load(src, 'dup');
        const second = xloader.scripts.load(src, 'dup');
        let secondDone = false;
        second.then(() => (secondDone = true));

        await settle();
        expect(secondDone).toBe(false);
        expect(console.warn).toHaveBeenCalledWith('ID "dup" is already registered.');

        script(src).onload();
        await expect(second).resolves.toBe(true);
        await expect(first).resolves.toEqual([src]);
    });

    test('rejects when the first load fails', async () => {
        const src = 'https://x.test/dup-fail.js';
        const first = xloader.scripts.load(src, 'dup-fail');
        const second = xloader.scripts.load(src, 'dup-fail');
        first.catch(() => {});
        second.catch(() => {});

        script(src).onerror();
        await expect(second).rejects.toThrow(`Failed to load: ${src}`);
    });
});

describe('ready() called before the ID is registered, and the load then fails', () => {
    test('raises no unhandled rejection, and still resolves true as before', async () => {
        const src = 'https://x.test/late-fail.js';
        const ready = xloader.loader.ready('late-fail');
        xloader.scripts.load(src, 'late-fail').catch(() => {});

        // ready() polls every 50 ms before it sees the load
        await settle(80);
        script(src).onerror();
        await settle();

        expect(unhandled).toEqual([]);
        await expect(ready).resolves.toBe(true);
    });
});

describe('img.load() with no <x-loader x-id> element on the page', () => {
    test('the image loads without throwing and the promise resolves', async () => {
        stubImage();
        const src = 'https://x.test/preload.png';
        const loading = xloader.img.load(src, 'img-no-element');

        expect(images).toHaveLength(1);
        expect(() => images[0].onload()).not.toThrow();
        await expect(loading).resolves.toEqual([src]);
    });
});

describe('<x-loader x-img> with several images', () => {
    test('every image is placed, then the tag is removed', () => {
        stubImage();
        const a = 'https://x.test/a.png';
        const b = 'https://x.test/b.png';
        const wrap = document.createElement('div');
        const tag = document.createElement('x-loader');
        tag.setAttribute('x-img', `${a},${b}`);
        tag.setAttribute('x-id', 'img-multi');
        wrap.appendChild(tag);
        document.body.appendChild(wrap);

        expect(images).toHaveLength(2);
        images[0].onload();
        expect(tag.isConnected).toBe(true);
        images[1].onload();

        expect([...wrap.querySelectorAll('img')].map((img) => img.getAttribute('src'))).toEqual([
            a,
            b,
        ]);
        expect(tag.isConnected).toBe(false);
    });

    test('a single image takes the place of the tag, as before', () => {
        stubImage();
        const src = 'https://x.test/single.png';
        const wrap = document.createElement('div');
        wrap.innerHTML =
            '<span></span><x-loader x-img="' + src + '" x-id="img-single"></x-loader><b></b>';
        document.body.appendChild(wrap);

        images[0].onload();
        expect([...wrap.children].map((el) => el.tagName)).toEqual(['SPAN', 'IMG', 'B']);
        expect(wrap.querySelector('img').getAttribute('src')).toBe(src);
    });
});

describe('lazy images', () => {
    test('fetchpriority="low" is set before the download starts', () => {
        let priority;
        stubImage((img) => (priority = img.getAttribute('fetchpriority')));
        xloader.img.load('https://x.test/lazy.png', { id: 'img-lazy', loadType: 'lazy' });

        expect(priority).toBe('low');
    });
});
