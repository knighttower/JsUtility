
# x-loader Documentation

## Overview
`x-loader` is a lightweight JavaScript library for dynamically loading scripts, CSS, and images. It provides utility methods for handling asset loading and dependency management efficiently.

## Why `x-loader`?

- **Lightweight:** No dependencies, minimal footprint.
- **Dynamic Loading:** Load assets on demand or based on user interactions.
- **Customizable:** Configure asset loading sequences and dependencies.
- **Declarative Loading:** Use `<x-loader>` for structured asset management.
- **Improved Performance Handling:** Utilizes `PerformanceObserver` for tracking asset readiness.
- **Image Loading:** Load images asynchronously with placeholder support.
- **Load Types:** Supports eager and lazy loading of assets (default is async).

---

## Installation
Include the library in your project:

```html
<script src="path/to/x-loader.js"></script>

<!-- From the mono-repo -->
<script src="https://cdn.jsdelivr.net/npm/knighttower@latest/packages/x-loader/dist/browser/x-loader.js"></script>

<!-- Directly from the package -->
<script src="https://cdn.jsdelivr.net/npm/@knighttower/x-loader@latest/dist/browser/x-loader.js"></script>
```

or install via npm:

```bash
npm install @knighttower/x-loader
```  

```javascript
import { xloader, domTracking } from '@knighttower/x-loader';
```

> Loading the library twice (for example the browser script **and** the npm import) is safe: the second copy reuses the first `window.xloader` and the `<x-loader>` element is only defined once.


---

## Features
- Dynamic and deferred loading of scripts, CSS, and images.
- Dependency management and asset readiness tracking.
- Custom HTML tag `<x-loader>` for declarative loading.
- Utility methods for checking asset readiness (`ready`, `isLoaded`, `hasId`).
- Uses `PerformanceObserver` for efficient tracking of first contentful paint.
- Fallback mechanisms using `requestAnimationFrame`.
- **Image placeholders:** Define `width` and `height` for placeholders before images load.

---

## Usage

### Example: Basic Script Loading
```html
<script>
    xloader.scripts.load('https://cdn.example.com/script.js', 'script-group-id').then(() => {
        console.log('Script loaded.');
    });
</script>
```

---

### Example: Using `<x-loader>` Custom Element

#### Scripts
```html
<x-loader x-js="https://cdn.example.com/script.js" x-id="script-group-id"></x-loader>
```

#### CSS
```html
<x-loader x-css="https://cdn.example.com/styles.css" x-id="css-group-id"></x-loader>
```

#### Images with Placeholder
```html
<x-loader 
    x-img="https://cdn.example.com/image.jpg"
    x-id="image-group-id"
    width="300"
    height="200"
></x-loader>
```
*The `width` and `height` attributes set a placeholder size before the image loads.*

Several images (comma separated) can share one tag, each one is placed in order where the tag is:

```html
<x-loader x-img="https://cdn.example.com/a.jpg,https://cdn.example.com/b.jpg" x-id="gallery"></x-loader>
```

#### Dependencies
```html
<x-loader x-js="https://cdn.example.com/plugin.js" x-id="plugin" x-dep="js_jquery"></x-loader>
```
*`x-dep` takes one or more IDs (comma separated). The asset loads once all of them are ready.*

---

## API Reference

### Loader Class

`xloader` has one loader per asset type, all with the same methods:
- `xloader.scripts` - JavaScript files
- `xloader.css` - Stylesheets
- `xloader.img` - Images
- `xloader.loader` - Only the checks (`ready`, `isLoaded`, `hasId`, `when`), for any type

#### `xloader.scripts.load(assets, id, loadType, attributes, element)`
#### `xloader.scripts.load(assets, { id, loadType, attributes, $element })`
- **Parameters** (as separate arguments or as an options object):
  - `assets` (String|Array): URL(s) of the assets.
  - `id` (String, optional): Unique identifier.
  - `loadType` (String, optional): `'eager'` or `'lazy'` (default is async). Lazy assets get `fetchpriority="low"` before the download starts.
  - `attributes` (Object, optional): Custom attributes.
  - `element` / `$element` (HTMLElement, optional): DOM element to append asset (for images, the placeholder to replace).
- **Returns:** `Promise`
- **Notes:**
  - Loading again with an ID that is already registered does not load anything; it resolves when the first load of that ID does.
  - Scripts added before `<body>` exists go into `<head>`.
  - `xloader.img.load()` with no placeholder on the page does not throw, so it can be used to preload images.
- **Example:**
  ```javascript
  xloader.scripts.load('https://cdn.example.com/script.js', 'group-id').then(() => {
      console.log('Loaded successfully.');
  });

  xloader.css.load(['https://cdn.example.com/a.css', 'https://cdn.example.com/b.css'], {
      id: 'styles',
      loadType: 'lazy',
  });
  ```

#### `xloader.scripts.ready(ids, timeout = 3000)`
- **Parameters:**
  - `ids` (String|Array): ID(s) to check readiness.
  - `timeout` (Number, optional): Milliseconds to wait for an asset that is already loading. An ID that is not registered yet is waited for up to 1 minute.
- **Returns:** `Promise`
- `ready()` can be called before `load()`: it resolves as soon as that ID is loaded, without polling delays.
- **Example:**
  ```javascript
  xloader.scripts.ready('group-id').then(() => {
      console.log('Assets are ready.');
  });
  xloader.loader.ready(['group-1', 'group-2']).then(() => {});
  ```

#### `xloader.scripts.isLoaded(ids)`
- **Parameters:** `ids` (String|Array): ID(s) to check load status (also true when `window[id]` exists).
- **Returns:** `Boolean`

#### `xloader.scripts.hasId(ids)`
- **Parameters:** `ids` (String|Array): ID(s) to check.
- **Returns:** `Boolean` - true when the ID(s) are registered (loading or loaded).

#### `xloader.loader.when(ids, timeout = 3000)`
Waits for a global (`window[id]`) to exist, for example a library that a script defines.
- **Parameters:**
  - `ids` (String|Array): Global name(s).
  - `timeout` (Number, optional): Milliseconds to wait before rejecting.
- **Returns:** `Promise` - resolves right away when the global already exists, otherwise right after the next script finishes loading (or a global set by inline code is found).
- **Example:**
  ```javascript
  xloader.loader.when('jQuery').then(() => {});
  xloader.loader.when(['jQuery', 'Vue']).then(() => {});
  ```

---

### DOM Tracking
#### `domTracking.afterLoad(callback)`
- Executes a callback after the DOM and assets are fully loaded.
- **Example:**
  ```javascript
  domTracking.afterLoad(() => {
      console.log('DOM fully loaded.');
  });
  ```

#### `domTracking.isReady(callback)`
- Executes a callback when the DOM is ready for interaction.
- **Example:**
  ```javascript
  domTracking.isReady(() => {
      console.log('DOM is ready.');
  });
  ```

---

## Attributes for `<x-loader>`
- **`x-js`**: URL(s) of JavaScript files.
- **`x-css`**: URL(s) of CSS files.
- **`x-img`**: URL(s) of image files.
- **`x-id`**: Unique asset identifier.
- **`x-dep`**: Dependencies (IDs, comma separated) to be ready before the asset loads.
- **`x-loading`**: Loading type (`'eager'` or `'lazy'`, default is async).
- **`width` & `height`**: Define placeholder dimensions before the image loads.

---

## Example Usage

### Full Implementation
```html
<!doctype html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>x-loader Demo</title>
        <script src="../dist/browser/x-loader.js"></script>
    </head>
    <body>
        <!-- Load JavaScript -->
        <x-loader x-js="https://code.jquery.com/jquery-3.7.1.min.js" x-id="js_jquery"></x-loader>
        <script>
            xloader.loader.ready('js_jquery').then(() => {
                console.log('jQuery is loaded.');
            });
        </script>

        <!-- Load Image with Placeholder -->
        <x-loader 
            x-img="https://placehold.co/600x400"
            x-id="placeholder_image"
            width="600"
            height="400"
        ></x-loader>
    </body>
</html>
```

---

## Enhancements in v1.2
- **Performance Optimizations**: `PerformanceObserver` ensures first contentful paint tracking.
- **Enhanced Fallback Handling**: Uses `requestAnimationFrame` for ensuring proper execution.
- **Improved Asset Registration**: `xloader.scripts.hasId()` for checking registered assets.
- **Better Debugging Support**: Improved logging and timeout handling.
- **Image Loading:** Images now support `width` and `height` for placeholders.
- **Default Load Type:** Async by default, with support for `'eager'` and `'lazy'` loading.

## Recent fixes
- **`ready()` resolves right away**: `load()` wakes the `ready()` calls waiting for its ID, instead of them polling every 50 ms.
- **`when()` resolves right after a script loads** (it listens for the load event), and right away when the global already exists.
- **Same ID twice**: `load()` with an ID that is already registered resolves when the first load finishes (it used to resolve immediately).
- **Several images in one `x-img`**: each image gets its own place; before, only the first one was shown.
- **Lazy loading**: `fetchpriority="low"` is set before `src`, so it applies to the download.
- **Image preloading**: `xloader.img.load()` without a placeholder on the page no longer throws.
- **Early scripts**: scripts loaded before `<body>` exists go into `<head>`.
- **Loaded twice**: the `<x-loader>` element is only defined once, so including the library twice no longer throws.
- **No unhandled rejections** from `ready()` when a load fails (the failure is still reported by `load()`).
- **Smaller browser build**: `dist/browser` and `dist/umd` no longer include core-js polyfills (`x-loader.js` stays around 6 KB).

---

## License
`x-loader` is open-source and available under the [MIT License](LICENSE).

---

For further details, refer to the source code and inline comments.

