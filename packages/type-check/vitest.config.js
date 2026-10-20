import { defineConfig } from 'vitest/config';

export default defineConfig({
    resolve: {
        // The repo is often opened through the E:\DEVELOPMENT directory symlink.
        // Without this, Vite resolves each test file to its real path, which lands
        // outside the Vitest root, and jsdom-environment tests then fail with
        // "Cannot find module '/@fs/...'".
        preserveSymlinks: true,
    },
});
