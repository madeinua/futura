import {defineConfig} from 'vite';

export default defineConfig({
    base: '/futura/',
    server: {
        port: 8080,
        open: '/index.html',
    },
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        cssCodeSplit: false,
        rollupOptions: {
            input: 'index.html',
            output: {
                entryFileNames: 'bundle.js',
                chunkFileNames: 'bundle.js',
                assetFileNames: (assetInfo) => {
                    const firstName = assetInfo.names?.[0] ?? '';
                    if (firstName.endsWith('.css')) {
                        return 'bundle.css';
                    }
                    return '[name][extname]';
                },
            },
        },
    },
});
