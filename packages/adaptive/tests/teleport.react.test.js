// @vitest-environment jsdom
// Teleport must accept elements rendered by React. React keeps its fiber on each DOM node
// (node.__reactFiber$... -> fiber, fiber.stateNode -> node), so anything that runs
// JSON.stringify on such an element throws "Converting circular structure to JSON".
import { describe, it, expect, beforeAll } from 'vitest';
import React, { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';

// jsdom has no matchMedia, match every query so the directives apply right away
window.matchMedia = (query) => ({
    matches: true,
    media: query,
    addEventListener() {},
    removeEventListener() {},
});
const { Adaptive } = await import('../src/Adaptive.js');
const { Teleport } = await import('../src/Teleport.js');

// Errors thrown inside custom element callbacks are reported on window, not thrown to the test
const errors = [];
beforeAll(() => {
    window.addEventListener('error', (event) => {
        errors.push(String(event.error ?? event.message));
        event.preventDefault();
    });
    Adaptive.useReact(React);
});

const render = (ui) => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    flushSync(() => createRoot(host).render(ui));
    return host;
};

const addTarget = (id) => {
    const target = document.createElement('div');
    target.id = id;
    document.body.appendChild(target);
    return target;
};

describe('Teleport with React-rendered elements', () => {
    it('<teleport-to> inside React moves its content to the target', () => {
        const target = addTarget('react-target');
        errors.length = 0;
        render(
            createElement(
                'teleport-to',
                { target: '#react-target' },
                createElement('span', { id: 'payload' }, 'p')
            )
        );
        expect(errors).toEqual([]);
        expect(target.querySelector('#payload')).not.toBeNull();
    });

    it('Adaptive.registerElement() accepts a React element with a teleport directive', () => {
        const hello = addTarget('hello');
        const host = render(
            createElement(
                'div',
                { id: 'mover', 'data-adaptive': 'teleport.desktop|mobile({before:"#hello"})' },
                'm'
            )
        );
        const element = host.querySelector('#mover');
        expect(() => Adaptive.registerElement(element)).not.toThrow();
        Adaptive.init();
        expect(hello.previousElementSibling).toBe(element);
    });
});

describe('Teleport props check', () => {
    // Only a selector string or an object (element or props) gets past the check
    it.each([
        ['undefined', undefined],
        ['null', null],
        ['0', 0],
        ['42', 42],
        ['true', true],
        ['an array', []],
        ['a function', () => {}],
    ])('exits early when props are %s', (label, props) => {
        expect(new Teleport(props).props).toBeUndefined();
    });
});
