/**
* @author Knighttower
    MIT License

    Copyright (c) [2022] [Knighttower] https://github.com/knighttower

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
*/

const { createApp } = Vue;
import Adaptive from 'Adaptive.js';
import hello from './hello.vue';
import compApiSample from './compApiSample.vue';

const app = createApp({});
//Optional | Add custom media query (min px, max px) settings (min max)
Adaptive.addQueryMinMax('kitty', 900, 1400);
// Optional | Add a custom media query expression (it accepts any valid media query)
Adaptive.addQueryExpression('doggy', '(min-width: 900px)');
// Needs to be instaciated right after the app and before the components
// The second parameter (optional, defaults to false) is to be in hybrid mode for Vue and Static JS(DOM),
Adaptive.useVue(app, true);
// Do components and other stuff right after
app.component('hello', hello);
app.component('comp-api-sample', compApiSample);

// Testing the code if there is a delay on load and how the Adaptive would react
setTimeout(() => {
    app.mount('#app');
}, '1');
