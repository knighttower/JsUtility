# URL Helper Documentation

A comprehensive utility for URL manipulation, parameter handling, and navigation operations in both browser and server environments.

## Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Basic Usage](#basic-usage)
- [Methods](#methods)
- [Properties](#properties)
- [Advanced Examples](#advanced-examples)
- [Server-Side Usage](#server-side-usage)
- [Browser Compatibility](#browser-compatibility)

---

## Overview

The URL Helper provides a unified interface for working with URLs, offering methods for:
- URL parameter parsing and manipulation
- Hash handling
- Navigation and window management
- Query string operations
- Cross-environment compatibility (browser/server)

### Features

- **Parameter Management** - Parse, retrieve, and modify URL parameters
- **Hash Operations** - Get, set, and remove URL hash values
- **Navigation Control** - Programmatic page navigation and window management
- **Query String Handling** - Build and manipulate query strings
- **Event Listening** - React to URL hash changes
- **Server Compatibility** - Works with server-side request objects
- **Caching** - Efficient parameter parsing with built-in caching

---

## Installation

```javascript
import { urlHelper } from './urlHelper.js';

// Browser usage
const url = urlHelper();

// Server usage (with request object)
const url = urlHelper(request);
```

---

## Basic Usage

```javascript
// Initialize the helper
const url = urlHelper();

// Get current page name
const pageName = url.getPage();

// Get URL parameters
const params = url.getQuery();

// Get specific parameter
const userId = url.getQuery('userId');

// Get current hash
const hash = url.getHash();

// Navigate to new URL
url.goTo('/new-page');
```

---

## Methods

### URL Information

#### `getPage()`
Retrieves the current page name from the URL (last segment before file extension).

**Returns:** `string` - Page name or 'index' if none found

```javascript
// URL: https://example.com/products/details.html
const page = url.getPage(); // Returns: 'details'

// URL: https://example.com/
const page = url.getPage(); // Returns: 'index'

// URL: https://example.com/about
const page = url.getPage(); // Returns: 'about'
```

### Parameter Management

#### `getParams()`
Retrieves comprehensive URL parameter information with multiple access methods.

**Returns:** `Object` with:
- `params` - URLSearchParams instance
- `queryString` - Raw query string
- `search` - Full search string including '?'
- `keys` - Array of parameter keys
- `values` - Array of parameter values
- `collection` - Object with key-value pairs

```javascript
// URL: https://example.com/search?q=javascript&page=2&sort=date
const paramData = url.getParams();

console.log(paramData.collection);  // { q: 'javascript', page: '2', sort: 'date' }
console.log(paramData.keys);        // ['q', 'page', 'sort']
console.log(paramData.values);      // ['javascript', '2', 'date']
console.log(paramData.queryString); // 'q=javascript&page=2&sort=date'
```

#### `getQuery(key?)`
Retrieves URL parameters as an object or specific parameter by key.

**Parameters:**
- `key` (optional) - Specific parameter key to retrieve

**Returns:** 
- Without key: `Object` - All parameters as key-value pairs
- With key: `string` - Value of the specified parameter

```javascript
// URL: https://example.com/search?q=javascript&page=2
const allParams = url.getQuery();        // { q: 'javascript', page: '2' }
const searchTerm = url.getQuery('q');    // 'javascript'
const pageNum = url.getQuery('page');    // '2'
const missing = url.getQuery('missing'); // undefined
```

#### `getQueryString()`
Retrieves the raw query string without the '?' prefix.

**Returns:** `string` - Query string

```javascript
// URL: https://example.com/search?q=javascript&page=2
const queryString = url.getQueryString(); // 'q=javascript&page=2'
```

#### `addToQuery(query)`
Adds new parameters to the current URL's query string.

**Parameters:**
- `query` - Object with key-value pairs to add

**Returns:** `Object` with:
- `collection` - Updated parameters object
- `queryString` - Updated query string

```javascript
// Current URL: https://example.com/search?q=javascript
const updated = url.addToQuery({ 
    page: 2, 
    sort: 'date',
    filter: 'recent' 
});

console.log(updated.collection);  // { q: 'javascript', page: 2, sort: 'date', filter: 'recent' }
console.log(updated.queryString); // 'q=javascript&page=2&sort=date&filter=recent'

// Use the updated query string
const newUrl = `${url.fullUrl}?${updated.queryString}`;
```

### Hash Operations

#### `getHash()`
Retrieves the hash portion of the URL without the '#' symbol.

**Returns:** `string` - Hash value

```javascript
// URL: https://example.com/page#section1
const hash = url.getHash(); // 'section1'

// URL: https://example.com/page
const hash = url.getHash(); // undefined or empty string
```

#### `setHash(hash)`
Sets the hash portion of the URL.

**Parameters:**
- `hash` - Hash value to set (without '#')

```javascript
url.setHash('new-section');
// Updates internal hash value
```

#### `deleteHash()`
Removes the hash from the URL using browser history API.

```javascript
// URL: https://example.com/page#section1
url.deleteHash();
// URL becomes: https://example.com/page
// Updates browser history without page reload
```

### Navigation

#### `goTo(url)`
Navigates to the specified URL.

**Parameters:**
- `url` - URL to navigate to

**Returns:** `boolean` - Always returns false

```javascript
// Navigate to different page
url.goTo('/products');
url.goTo('https://example.com/contact');

// Relative navigation
url.goTo('../parent-directory');
url.goTo('?search=new');
```

#### `open(url, name?, params?)`
Opens a URL in a new window or tab.

**Parameters:**
- `url` - URL to open
- `name` (optional) - Target window name (default: '_blank')
- `params` (optional) - Window parameters

**Returns:** `Window` - Reference to opened window

```javascript
// Open in new tab
const newWindow = url.open('https://example.com');

// Open in named window
const popup = url.open('/help', 'helpWindow');

// Open with specific parameters
const customWindow = url.open(
    '/popup-content',
    'popup',
    'width=500,height=400,scrollbars=yes'
);

// Control the opened window
customWindow.focus();
```

### Event Handling

#### `onChange(callback)`
Sets up a listener for URL hash changes.

**Parameters:**
- `callback` - Function to execute when hash changes

```javascript
// Listen for hash changes
url.onChange((event) => {
    console.log('Hash changed!');
    console.log('New hash:', url.getHash());
    console.log('Old URL:', event.oldURL);
    console.log('New URL:', event.newURL);
});

// Example: Single Page Application routing
url.onChange(() => {
    const section = url.getHash();
    switch(section) {
        case 'home':
            showHomeContent();
            break;
        case 'about':
            showAboutContent();
            break;
        case 'contact':
            showContactContent();
            break;
        default:
            showDefaultContent();
    }
});
```

---

## Properties

The URL helper exposes several read-only properties for easy access to URL components:

### `fullUrl`
Complete URL including protocol, host, and path.

```javascript
// URL: https://example.com/products/list
console.log(url.fullUrl); // 'https://example.com/products/list'
```

### `siteUrl`
Base site URL with protocol and host.

```javascript
// URL: https://example.com/products/list
console.log(url.siteUrl); // 'https://example.com'
```

### `protocol`
Protocol portion without the colon.

```javascript
// URL: https://example.com
console.log(url.protocol); // 'https'

// URL: http://localhost:3000
console.log(url.protocol); // 'http'
```

### `host`
Host including hostname and port.

```javascript
// URL: https://example.com
console.log(url.host); // 'example.com'

// URL: http://localhost:3000
console.log(url.host); // 'localhost:3000'
```

### `path`
Pathname portion of the URL.

```javascript
// URL: https://example.com/products/list
console.log(url.path); // '/products/list'

// URL: https://example.com/
console.log(url.path); // '/'
```

### `readUrl`
Full URL string (alias for href).

```javascript
console.log(url.readUrl); // Complete URL string
```

---

## Advanced Examples

### Building Dynamic URLs

```javascript
// Create dynamic search URLs
function buildSearchUrl(term, filters = {}) {
    const baseQuery = { q: term };
    const fullQuery = url.addToQuery({ ...baseQuery, ...filters });
    return `${url.siteUrl}/search?${fullQuery.queryString}`;
}

const searchUrl = buildSearchUrl('javascript', { 
    category: 'tutorials',
    difficulty: 'beginner',
    page: 1 
});
// Result: 'https://example.com/search?q=javascript&category=tutorials&difficulty=beginner&page=1'
```

### Parameter Validation and Processing

```javascript
// Validate and process URL parameters
function processSearchParams() {
    const params = url.getQuery();
    
    // Validate required parameters
    if (!params.q) {
        throw new Error('Search query is required');
    }
    
    // Process parameters with defaults
    return {
        query: params.q,
        page: parseInt(params.page) || 1,
        limit: parseInt(params.limit) || 10,
        sort: params.sort || 'relevance',
        filters: {
            category: params.category || 'all',
            dateRange: params.dateRange || 'any'
        }
    };
}

try {
    const searchConfig = processSearchParams();
    performSearch(searchConfig);
} catch (error) {
    console.error('Invalid search parameters:', error.message);
    showError(error.message);
}
```

### Single Page Application Routing

```javascript
// SPA routing system
class Router {
    constructor() {
        this.url = urlHelper();
        this.routes = new Map();
        this.setupHashRouting();
    }
    
    addRoute(hash, handler) {
        this.routes.set(hash, handler);
    }
    
    setupHashRouting() {
        // Handle initial load
        this.handleRoute();
        
        // Listen for hash changes
        this.url.onChange(() => this.handleRoute());
    }
    
    handleRoute() {
        const currentHash = this.url.getHash() || 'home';
        const handler = this.routes.get(currentHash);
        
        if (handler) {
            handler();
        } else {
            this.handleNotFound(currentHash);
        }
    }
    
    navigate(hash) {
        this.url.setHash(hash);
        window.location.hash = hash;
    }
    
    handleNotFound(hash) {
        console.warn(`Route not found: ${hash}`);
        this.navigate('home');
    }
}

// Usage
const router = new Router();

router.addRoute('home', () => {
    document.getElementById('content').innerHTML = '<h1>Home Page</h1>';
});

router.addRoute('about', () => {
    document.getElementById('content').innerHTML = '<h1>About Page</h1>';
});

router.addRoute('contact', () => {
    document.getElementById('content').innerHTML = '<h1>Contact Page</h1>';
});
```

### URL Parameter Persistence

```javascript
// Persist form state in URL parameters
class FormStateManager {
    constructor(formElement) {
        this.form = formElement;
        this.url = urlHelper();
        this.restoreFromUrl();
        this.setupAutoSave();
    }
    
    restoreFromUrl() {
        const params = this.url.getQuery();
        
        // Restore form fields from URL parameters
        for (const [key, value] of Object.entries(params)) {
            const field = this.form.querySelector(`[name="${key}"]`);
            if (field) {
                if (field.type === 'checkbox') {
                    field.checked = value === 'true';
                } else {
                    field.value = value;
                }
            }
        }
    }
    
    saveToUrl() {
        const formData = new FormData(this.form);
        const params = {};
        
        for (const [key, value] of formData.entries()) {
            params[key] = value;
        }
        
        const updated = this.url.addToQuery(params);
        const newUrl = `${this.url.fullUrl}?${updated.queryString}`;
        
        // Update URL without page reload
        history.replaceState(null, '', newUrl);
    }
    
    setupAutoSave() {
        this.form.addEventListener('input', () => {
            this.saveToUrl();
        });
    }
}

// Usage
const form = document.getElementById('searchForm');
const stateManager = new FormStateManager(form);
```

### Multi-tab Communication

```javascript
// Communicate between tabs using URL hash
class TabCommunicator {
    constructor() {
        this.url = urlHelper();
        this.listeners = new Map();
        this.setupCommunication();
    }
    
    setupCommunication() {
        this.url.onChange(() => {
            const hash = this.url.getHash();
            if (hash.startsWith('msg:')) {
                this.handleMessage(hash.substring(4));
            }
        });
    }
    
    sendMessage(type, data) {
        const message = `msg:${type}:${JSON.stringify(data)}`;
        this.url.setHash(message);
        window.location.hash = message;
        
        // Clear message after short delay
        setTimeout(() => {
            this.url.deleteHash();
        }, 100);
    }
    
    onMessage(type, callback) {
        if (!this.listeners.has(type)) {
            this.listeners.set(type, []);
        }
        this.listeners.get(type).push(callback);
    }
    
    handleMessage(message) {
        const [type, dataStr] = message.split(':');
        try {
            const data = JSON.parse(dataStr);
            const callbacks = this.listeners.get(type) || [];
            callbacks.forEach(callback => callback(data));
        } catch (error) {
            console.error('Invalid message format:', message);
        }
    }
}

// Usage
const communicator = new TabCommunicator();

// Listen for user login events
communicator.onMessage('userLogin', (userData) => {
    updateUserInterface(userData);
});

// Send login event to other tabs
communicator.sendMessage('userLogin', { 
    userId: 123, 
    username: 'john_doe' 
});
```

---

## Server-Side Usage

The URL helper can be used in server-side environments by passing a request object:

### Node.js/Express Example

```javascript
import { urlHelper } from './urlHelper.js';

// Express middleware
app.use((req, res, next) => {
    // Create URL helper with request object
    req.urlHelper = urlHelper({
        uri: {
            protocol: req.protocol,
            host: req.get('host'),
            pathname: req.path,
            search: req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : '',
            hash: '', // Server doesn't typically handle hash
            href: `${req.protocol}://${req.get('host')}${req.originalUrl}`
        }
    });
    next();
});

// Route handler
app.get('/search', (req, res) => {
    const url = req.urlHelper;
    
    // Get search parameters
    const query = url.getQuery('q');
    const page = parseInt(url.getQuery('page')) || 1;
    
    // Build pagination URLs
    const baseQuery = url.getQuery();
    const nextPage = url.addToQuery({ ...baseQuery, page: page + 1 });
    const prevPage = url.addToQuery({ ...baseQuery, page: Math.max(1, page - 1) });
    
    res.json({
        currentPage: page,
        query: query,
        nextPageUrl: `${url.fullUrl}?${nextPage.queryString}`,
        prevPageUrl: page > 1 ? `${url.fullUrl}?${prevPage.queryString}` : null
    });
});
```

### Server-Side URL Building

```javascript
// Server-side URL construction utility
function createServerUrlHelper(req) {
    return urlHelper({
        uri: {
            protocol: req.secure ? 'https:' : 'http:',
            host: req.get('host'),
            pathname: req.path,
            search: req.query ? '?' + new URLSearchParams(req.query).toString() : '',
            href: `${req.protocol}://${req.get('host')}${req.originalUrl}`
        }
    });
}

// Usage in route handlers
app.get('/api/products', (req, res) => {
    const url = createServerUrlHelper(req);
    
    // Process query parameters
    const filters = {
        category: url.getQuery('category'),
        priceMin: parseFloat(url.getQuery('priceMin')) || 0,
        priceMax: parseFloat(url.getQuery('priceMax')) || Infinity,
        page: parseInt(url.getQuery('page')) || 1
    };
    
    // Build response with pagination URLs
    const baseUrl = url.fullUrl;
    const currentQuery = url.getQuery();
    
    res.json({
        products: getProducts(filters),
        pagination: {
            current: filters.page,
            next: `${baseUrl}?${url.addToQuery({...currentQuery, page: filters.page + 1}).queryString}`,
            prev: filters.page > 1 ? `${baseUrl}?${url.addToQuery({...currentQuery, page: filters.page - 1}).queryString}` : null
        }
    });
});
```

---

## Browser Compatibility

The URL helper is compatible with modern browsers supporting:

- **ES6+ Features**: Arrow functions, destructuring, template literals
- **URLSearchParams API**: For parameter parsing (supported in all modern browsers)
- **History API**: For hash manipulation without page reload
- **Window.open**: For popup window management

### Polyfill Requirements

For older browser support, consider polyfills for:
- URLSearchParams (IE/Edge < 17)
- History API (IE < 10)

### Feature Detection

```javascript
// Check for required features
const hasUrlSearchParams = typeof URLSearchParams !== 'undefined';
const hasHistoryApi = typeof history !== 'undefined' && history.pushState;

if (!hasUrlSearchParams) {
    console.warn('URLSearchParams not supported, parameter parsing may be limited');
}

if (!hasHistoryApi) {
    console.warn('History API not supported, hash deletion will cause page reload');
}
```

---

## Performance Considerations

### Caching
- URL parameters are parsed once and cached for subsequent access
- Cache is maintained throughout the helper instance lifetime
- Re-parsing only occurs if the URL changes

### Memory Management
- Event listeners are properly registered
- No automatic cleanup - remove listeners manually if needed
- Consider debouncing hash change handlers for frequent updates

### Best Practices

```javascript
// Efficient parameter access
const url = urlHelper();
const params = url.getParams(); // Parse once
const query = params.collection; // Reuse parsed data

// Avoid repeated parsing
const userId = query.userId;     // Good
const userId = url.getQuery('userId'); // Works but may re-parse

// Debounce hash changes for performance
let hashChangeTimeout;
url.onChange(() => {
    clearTimeout(hashChangeTimeout);
    hashChangeTimeout = setTimeout(() => {
        handleHashChange();
    }, 150);
});
```

## Error Handling

The URL helper includes built-in error handling for common scenarios:

```javascript
// Safe parameter access
const url = urlHelper();

// Returns undefined for missing parameters
const missingParam = url.getQuery('nonexistent'); // undefined

// Graceful degradation in server environments
const page = url.getPage(); // Returns 'index' if URL parsing fails

// Window operations check for browser environment
const newWindow = url.open('/page'); // Returns undefined in server environment
```

## Migration Guide

If migrating from native URL APIs:

```javascript
// Before (native)
const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('userId');
const hash = window.location.hash.substring(1);

// After (urlHelper)
const url = urlHelper();
const userId = url.getQuery('userId');
const hash = url.getHash();

// Before (manual parsing)
const pathname = window.location.pathname;
const pageName = pathname.split('/').pop().split('.')[0] || 'index';

// After (urlHelper)
const pageName = url.getPage();
```
