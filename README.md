## MonoRepo of JS Classes, Libraries, and Tools.

It holds the following packages:
- [**TypeCheck JS**](https://github.com/knighttower/JsUtility/tree/development/packages/type-check): A simple type checker for JavaScript.
- [**JS Utility**](https://github.com/knighttower/JsUtility/tree/development/packages/utility): Collection of libraries with classes and functions for JavaScript
- [**Node Utils**](https://github.com/knighttower/JsUtility/tree/development/packages/utility/nodeUtils): Collection of libraries with classes and functions for node.js
- [**js-event-bus**](https://github.com/knighttower/JsUtility/tree/development/packages/utility/src/event-bus): Simple Event Bus library built for any JavaScript application.
- [**Adaptive Js**](https://github.com/knighttower/JsUtility/tree/development/packages/adaptive): Adaptive.js: Enhancing Layout Adaptability Beyond CSS, Navigating the Complexities of Modern Web Development
- [**Vue Utils**](https://github.com/knighttower/JsUtility/tree/development/packages/vue-utils): Vue utilities for Vue.js applications. 
- [**BlockUi**](https://github.com/knighttower/JsUtility/tree/development/packages/block-ui): tiny UI blocking utility.  
- [**Toast**](https://github.com/knighttower/JsUtility/tree/development/packages/toast): A dead simple toast notification library for JavaScript.
 - [**x-loader**](https://github.com/knighttower/JsUtility/tree/development/packages/x-loader): A lightweight JavaScript library for dynamically loading scripts, CSS, and images.
 
### All packages are ESM and CJS compatible.

## What's new

A round of fixes and upgrades landed in these packages. See each README for the details:

- **[utility](https://github.com/knighttower/JsUtility/tree/development/packages/utility)**: `getGoogleMapsAddress` and `openGoogleMapsAddress` were removed. ESM sub-path imports (`/powerHelpers`, `/promises`, `/EventBus`...) now load from `src`. Many functions were fixed (`convertToBool`, `dateFormat`, `decimalToCurrency`, `emptyOrValue`, `extend`, `includes`, `isEmpty`, `isNumber`, `instanceOf`, `toDollarString`, `validateEmail`, `validatePhone`), along with the powerHelper string parsers, the EventBus wildcards, and `promiseQueue` / `promisePool` / `doTimeout`.
- **[type-check](https://github.com/knighttower/JsUtility/tree/development/packages/type-check)**: `validType()` is faster, failed tests never throw by themselves (BigInt / circular values), `{any: type, key?: type}` and `{key: type, any: type, ...}` work, `_tc()` takes string options, `_tcx()` has `.test()`, and memory use is lower.
- **[adaptive](https://github.com/knighttower/JsUtility/tree/development/packages/adaptive)**: no longer depends on type-check, and Teleport works with React-rendered elements.
- **[x-loader](https://github.com/knighttower/JsUtility/tree/development/packages/x-loader)**: `ready()` / `when()` resolve right away, several images per tag, lazy `fetchpriority`, safe to load twice, and more.
- Browser (`dist/browser`) and UMD builds of type-check, adaptive and x-loader no longer include core-js polyfills, so they are smaller.

## Installation

All packages are available on npm and via browser with jsDelivr. Check the README.md of each package for more information.
If you want to install all packages at once as a build tool, you can use the following command:
```bash
npm install knighttower
```
for browser use: see all packages on [jsDelivr](https://cdn.jsdelivr.net/npm/knighttower@latest/packages/)

<br>

## Usage

available packages are:
- TypeCheck
- EventBus
- utility
- NodeUtils
- AdaptiveJs
- x-loader

Paths (aliases):
- TypeCheck: `knighttower/type-check`
- EventBus: `knighttower/utility/event-bus` (or `knighttower/utility/EventBus`)
- utility: `knighttower/utility`
- NodeUtils: `knighttower/utility/nodeUtils`
- AdaptiveJs: `knighttower/adaptive`
- x-loader: `knighttower/x-loader`

Access src or dist files:
- TypeCheck: `knighttower/type-check/dist/*`
- EventBus: `knighttower/utility/dist/*` (EventBus.js / EventBus.cjs)
- utility: `knighttower/utility/dist/*`
- NodeUtils: `knighttower/utility/nodeUtils/*`
- AdaptiveJs: `knighttower/adaptive/dist/*`
- x-loader: `knighttower/x-loader/dist/*`

Import what you need from the package. like this:
```javascript
import { typeCheck, validType } from 'knighttower/type-check';
import { EventBus } from 'knighttower/utility/event-bus';
import { emptyOrValue, typeOf } from 'knighttower/utility';
import * as utility from 'knighttower/utility';
import { Adaptive } from 'knighttower/adaptive';
import { xloader } from 'knighttower/x-loader';
// Node only (CommonJS)
const nodeUtils = require('knighttower/utility/nodeUtils');
```

## Notes:
Some IDE wont show the src code when import in the file (peaking). You can use the 'package' routes if you want to be able to click and see the peak view for that.
- TypeCheck: `knighttower/packages/type-check`
- EventBus: `knighttower/packages/utility/src/event-bus`
- utility: `knighttower/packages/utility`
- NodeUtils: `knighttower/packages/utility/nodeUtils`
- AdaptiveJs: `knighttower/packages/adaptive`
- x-loader: `knighttower/packages/x-loader`


