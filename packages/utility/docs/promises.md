# Promise Utilities Documentation

A collection of powerful utilities for managing promises, async operations, and polling mechanisms with advanced features like queuing, pooling, and event-driven status tracking.

## Table of Contents

- [promiseQueue](#promisequeue)
- [promisePool](#promisepool)
- [doPoll](#dopoll)
- [doTimeout](#dotimeout)
- [doAsync](#doasync)

---

## promiseQueue

A sequential promise execution queue that processes promises one at a time with comprehensive status tracking and event emission.

### Features

- Sequential promise execution (one at a time)
- Real-time status tracking
- Event-driven notifications
- Support for promise arrays
- Error handling and aggregation
- Automatic function-to-promise conversion

### Usage

```javascript
import { promiseQueue } from './promises.js';

const queue = promiseQueue();

// Add individual promises
queue.add(fetch('https://api.example.com/data1'));
queue.add(fetch('https://api.example.com/data2'));

// Add promise-returning functions
queue.add(() => fetch('https://api.example.com/data3'));

// Add arrays of promises
queue.add([
    fetch('https://api.example.com/data4'),
    fetch('https://api.example.com/data5')
]);

// Listen for completion
queue.on('completed', (stats) => {
    console.log('All promises completed:', stats);
});

queue.on('done', (stats) => {
    console.log('Queue processing finished:', stats);
});

queue.on('fail', (error) => {
    console.log('Invalid promise added:', error);
});
```

### Methods

#### `add(promise)`
Adds a promise, function, or array of promises to the queue.

**Parameters:**
- `promise` - A Promise, function returning a Promise, or array of either

**Example:**
```javascript
// Add a promise
queue.add(fetch('/api/data'));

// Add a function
queue.add(() => new Promise(resolve => setTimeout(resolve, 1000)));

// Add multiple promises
queue.add([promise1, promise2, promise3]);
```

#### `clear()`
Clears the entire queue and resets all statistics.

**Returns:** `this` (for method chaining)

```javascript
queue.clear();
```

#### `status()`
Returns the current queue status.

**Returns:** `'done'` | `'in-progress'`

```javascript
if (queue.status() === 'done') {
    console.log('Queue is complete');
}
```

#### `stats()`
Returns detailed statistics about the queue.

**Returns:** Object with:
- `completed` - Number of successfully completed promises
- `rejected` - Number of rejected promises
- `pending` - Number of pending promises
- `total` - Total number of promises added
- `errors` - Concatenated error messages
- `promises` - Array of all processed promise objects

```javascript
const stats = queue.stats();
console.log(`${stats.completed}/${stats.total} promises completed`);
```

### Events

- `completed` - Emitted when all promises are processed
- `done` - Emitted when queue processing finishes
- `fail` - Emitted when an invalid promise is added

---

## promisePool

A concurrent promise execution pool with configurable concurrency limits, ideal for managing multiple async operations while controlling resource usage.

### Features

- Configurable concurrency control
- Event-driven status updates
- Real-time statistics
- Support for both promises and functions
- Automatic queue management
- Comprehensive error handling

### Usage

```javascript
import { promisePool } from './promises.js';

// Create a pool with max 5 concurrent promises
const pool = promisePool(5);

// Add promises to the pool
pool.add(fetch('https://api.example.com/data1'));
pool.add(fetch('https://api.example.com/data2'));

// Add functions that return promises
pool.add(() => fetch('https://api.example.com/data3'));

// Add arrays of promises
pool.add([
    fetch('https://api.example.com/data4'),
    fetch('https://api.example.com/data5')
]);

// Listen for events
pool.on('completed', (stats) => {
    console.log('All promises completed:', stats);
});

pool.on('rejected', (rejectedPromises, stats) => {
    console.log('Some promises failed:', rejectedPromises);
});

pool.on('stats', (stats) => {
    console.log('Current progress:', stats);
});
```

### Constructor

```javascript
const pool = promisePool(maxConcurrency = 10);
```

**Parameters:**
- `maxConcurrency` - Maximum number of concurrent promises (default: 10)

### Methods

#### `add(promises)`
Adds promises or functions to the pool for execution.

**Parameters:**
- `promises` - A Promise, function, or array of either

#### `clear()`
Clears all promises and resets the pool state.

```javascript
pool.clear();
```

#### `status()`
Returns the current pool status.

**Returns:** `'not-started'` | `'in-progress'` | `'done'`

#### `isDone()`
Checks if the pool has finished processing all promises.

**Returns:** `boolean`

```javascript
if (pool.isDone()) {
    console.log('Pool is complete');
}
```

#### `isEmpty()`
Checks if the pool has no promises.

**Returns:** `boolean`

#### `results()` / `stats()`
Returns detailed statistics about the pool.

**Returns:** Object with:
- `completed` - Number of completed promises
- `rejected` - Number of rejected promises
- `pending` - Number of pending promises
- `total` - Total number of promises added
- `errors` - Concatenated error messages
- `promises` - Object containing all promise instances

### Events

- `completed` - Emitted when all promises are processed (only if promises were added)
- `done` - Emitted when processing finishes (always emitted)
- `rejected` - Emitted when some promises are rejected
- `stats` - Emitted on status updates

---

## doPoll

A powerful polling utility that continuously executes a function until a condition is met, with configurable intervals, timeouts, and abort signals.

### Features

- Configurable polling intervals
- Timeout support
- AbortSignal integration
- Support for both sync and async functions
- Flexible completion conditions
- Error handling

### Usage

```javascript
import { doPoll } from './promises.js';

// Basic polling
const { promise, stop } = doPoll(() => {
    // Check some condition
    return document.getElementById('target') !== null;
}, {
    interval: 100,  // Check every 100ms
    timeout: 5000   // Give up after 5 seconds
});

promise.then(result => {
    console.log('Element found:', result);
}).catch(error => {
    console.log('Polling failed:', error);
});

// Async polling
const { promise: asyncPromise } = doPoll(async () => {
    const response = await fetch('/api/status');
    const data = await response.json();
    return data.ready; // Continue polling until ready is true
});

// Manual stop
const { promise: manualPromise, stop: manualStop } = doPoll(() => {
    // Some condition
    return Math.random() > 0.9;
});

// Stop polling manually
setTimeout(() => manualStop('Manual cancellation'), 2000);
```

### Parameters

```javascript
const { promise, stop } = doPoll(fn, options);
```

**Parameters:**
- `fn` - Function to poll (can return Promise or boolean)
- `options` - Configuration object

**Options:**
- `interval` - Polling interval in milliseconds (default: 200)
- `timeout` - Maximum polling time in milliseconds (default: 10000)
- `timeoutMsg` - Custom timeout message
- `msg` - General message for logging
- `signal` - AbortSignal for cancellation

**Returns:** Object with:
- `promise` - Promise that resolves when polling succeeds
- `stop` - Function to manually stop polling

### Function Behavior

The polling function can:
- Return `true`/`false` - Continue/stop polling
- Return any truthy/falsy value - Stop with value/continue
- Return a Promise - Wait for resolution
- Throw an error - Stop with rejection

### AbortSignal Integration

```javascript
const controller = new AbortController();
const { promise } = doPoll(() => checkCondition(), {
    signal: controller.signal
});

// Cancel polling
controller.abort('User cancelled');
```

---

## doTimeout

A flexible timeout utility that supports ID-based timeout management, polling loops, and force execution.

### Features

- ID-based timeout management
- Automatic cleanup
- Polling loop support
- Force execution capability
- Multiple parameter formats
- Namespace isolation

### Usage

```javascript
import { doTimeout } from './promises.js';

// Basic timeout with ID
doTimeout('myTimeout', 1000, () => {
    console.log('Executed after 1 second');
});

// Timeout without ID
doTimeout(1000, () => {
    console.log('Anonymous timeout');
});

// Cancel timeout by ID
doTimeout('myTimeout'); // Cancels the timeout

// Force immediate execution
doTimeout('myTimeout', 0); // Executes immediately

// Polling loop (returns true to continue)
doTimeout('poller', 100, function() {
    if (someCondition()) {
        console.log('Condition met, stopping');
        return false; // Stop polling
    }
    console.log('Still polling...');
    return true; // Continue polling
});

// Pass arguments to callback
doTimeout('withArgs', 1000, (name, age) => {
    console.log(`Hello ${name}, you are ${age} years old`);
}, 'John', 30);
```

### Syntax Variations

```javascript
// With ID
doTimeout(id, delay, callback, ...args)

// Without ID  
doTimeout(delay, callback, ...args)

// Cancel by ID
doTimeout(id)

// Force execution
doTimeout(id, 0)
```

### Parameters

- `idOrDelay` - Unique ID string or delay number
- `delayOrCallback` - Delay in ms or callback function
- `callback` - Function to execute (if ID provided)
- `...args` - Arguments to pass to callback

### Return Value

- `true` - If timeout was successfully set
- `undefined` - If timeout was cancelled or forced

### Polling Loops

When the callback returns `true`, the timeout will re-execute after the delay, creating a polling loop:

```javascript
let attempts = 0;
doTimeout('retry', 1000, function() {
    attempts++;
    
    if (attempts >= 5) {
        console.log('Max attempts reached');
        return false; // Stop
    }
    
    if (tryOperation()) {
        console.log('Operation succeeded');
        return false; // Stop
    }
    
    console.log(`Attempt ${attempts} failed, retrying...`);
    return true; // Continue
});
```

---

## doAsync

A utility that standardizes synchronous and asynchronous function execution into a consistent Promise-based workflow.

### Features

- Handles both sync and async functions uniformly
- Automatic Promise wrapping
- Error handling
- Argument passing
- Type safety

### Usage

```javascript
import { doAsync } from './promises.js';

// Wrap synchronous function
const syncResult = await doAsync(() => {
    return 'Synchronous result';
});

// Wrap asynchronous function
const asyncResult = await doAsync(async () => {
    const response = await fetch('/api/data');
    return response.json();
});

// Pass arguments
const resultWithArgs = await doAsync((name, age) => {
    return `${name} is ${age} years old`;
}, 'John', 30);

// Handle errors uniformly
try {
    const result = await doAsync(() => {
        throw new Error('Something went wrong');
    });
} catch (error) {
    console.log('Caught error:', error.message);
}

// Works with Promise-returning functions
const promiseResult = await doAsync(() => {
    return new Promise(resolve => {
        setTimeout(() => resolve('Delayed result'), 1000);
    });
});
```

### Parameters

```javascript
doAsync(fn, ...args)
```

- `fn` - Function to execute (sync or async)
- `...args` - Arguments to pass to the function

### Returns

- `Promise<any>` - Always returns a Promise that resolves with the function's return value

### Error Handling

Both synchronous throws and Promise rejections are caught and converted to Promise rejections:

```javascript
// Sync error
doAsync(() => {
    throw new Error('Sync error');
}).catch(err => console.log(err));

// Async error
doAsync(async () => {
    throw new Error('Async error');
}).catch(err => console.log(err));
```

---

## Advanced Examples

### Combining Utilities

```javascript
// Use doAsync with promisePool for mixed sync/async operations
const pool = promisePool(3);

pool.add(() => doAsync(syncFunction, arg1, arg2));
pool.add(() => doAsync(asyncFunction, arg3, arg4));

// Use doPoll with doTimeout for complex polling
const { promise } = doPoll(() => {
    return doAsync(checkApiStatus);
}, { interval: 500, timeout: 10000 });

// Chain with doTimeout for delayed execution
doTimeout('delayed-pool', 1000, () => {
    pool.add(somePromise);
});
```

### Error Handling Patterns

```javascript
// Comprehensive error handling with promisePool
const pool = promisePool(5);

pool.on('rejected', (errors, stats) => {
    console.log(`${errors.length} promises failed out of ${stats.total}`);
    errors.forEach(error => console.error('Error:', error));
});

pool.on('completed', (stats) => {
    if (stats.rejected > 0) {
        console.log('Some operations failed, but pool completed');
    } else {
        console.log('All operations successful');
    }
});
```

### Real-world Use Cases

```javascript
// File upload with progress tracking
const uploadPool = promisePool(3);
const files = [...fileInput.files];

files.forEach(file => {
    uploadPool.add(() => uploadFile(file));
});

uploadPool.on('stats', (stats) => {
    const progress = (stats.completed / stats.total) * 100;
    updateProgressBar(progress);
});

// API retry mechanism
const { promise } = doPoll(async () => {
    try {
        const response = await fetch('/api/data');
        if (response.ok) {
            return await response.json();
        }
        return false; // Continue polling
    } catch (error) {
        return false; // Continue polling on error
    }
}, {
    interval: 1000,
    timeout: 30000,
    timeoutMsg: 'API call timed out after 30 seconds'
});

// Batch processing with queue
const queue = promiseQueue();
const batchItems = getItemsToProcess();

batchItems.forEach(item => {
    queue.add(() => processItem(item));
});

queue.on('completed', () => {
    console.log('All items processed');
    cleanupResources();
});
```

## Browser Compatibility

These utilities are compatible with modern browsers that support:
- Promises (ES6)
- Arrow functions
- Destructuring assignment
- Rest/spread parameters
- AbortSignal (for doPoll)

For older browser support, consider using appropriate polyfills.

## Performance Considerations

- **promiseQueue**: Sequential execution may be slower but prevents overwhelming resources
- **promisePool**: Concurrent execution is faster but should be tuned based on available resources
- **doPoll**: Frequent polling can impact performance; adjust intervals appropriately
- **doTimeout**: Efficient for delayed execution; automatic cleanup prevents memory leaks

## Error Handling

All utilities provide comprehensive error handling:
- Invalid inputs are logged with helpful error messages
- Promise rejections are properly caught and reported
- Event emissions allow for custom error handling
- Cleanup is automatic to prevent memory leaks
