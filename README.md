## MonoRepo of JS Classes, Libraries, and Tools.

It holds the following packages:
- [**TypeCheck JS**](https://github.com/knighttower/JsUtility/tree/development/packages/type-check): A simple type checker for JavaScript.
- [**JS Utility**](https://github.com/knighttower/JsUtility/tree/development/packages/utility): Collection of libraries with classes and functions for JavaScript
- [**Node Utils**](https://github.com/knighttower/JsUtility/tree/development/packages/utility/nodeUtils): Collection of libraries with classes and functions for node.js
- [**js-event-bus**](https://github.com/knighttower/JsUtility/tree/development/packages/event-bus): Simple Event Bus library built for any JavaScript application.
- [**BootsTrap Mini**](https://github.com/knighttower/JsUtility/tree/development/packages/bootstrap-mini-css): Built on top of Bootstrap but modified to have only the basic utilities classes and the grid system.

### All pacckages are ESM and CJS compatible.

## Installation

All packages are available on npm and via browser with jsDelivr. Check the README.md of each package for more information.
If you want to install all packages at once as a build tool, you can use the following command:
```bash
npm install knighttower
```

## Usage

available packages are:
- TypeCheck
- EventBus
- Utility
- BootstrapMiniCss

Paths (aliases):
- TypeCheck: `knighttower/type-check`
- EventBus: `knighttower/event-bus`
- Utility: `knighttower/utility`
- NodeUtils: `knighttower/utility/nodeUtils`
- BootstrapMiniCss: `knighttower/bootstrap-mini-css`

Access src or dist files:
- TypeCheck: `knighttower/type-check/dist/*`
- EventBus: `knighttower/event-bus/dist/*`
- Utility: `knighttower/utility/dist/*`
- NodeUtils: `knighttower/utility/nodeUtils/*`

Import what you need from the package. like this:
```javascript
import { TypeCheck } from 'knighttower/type-check';
import { EventBus } from 'knighttower/event-bus';
import { Utility } from 'knighttower/utility';
import 'knighttower/bootstrap-mini-css';
```

## Notes:
Some IDE wont show the src code when import in the file (peaking). You can use the 'package' routes if you want to be able to click and see the peak view for that.
- TypeCheck: `knighttower/packages/type-check`
- EventBus: `knighttower/packages/event-bus`
- Utility: `knighttower/packages/utility`
- NodeUtils: `knighttower/packages/utility/nodeUtils`
- BootstrapMiniCss: `knighttower/packages/bootstrap-mini-css`


