import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import { wayfinder } from '@laravel/vite-plugin-wayfinder';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            ssr: 'resources/js/ssr.jsx',
            refresh: true,
        }),
        react(),
        wayfinder({
            routes: false,
            actions: true,
            formVariants: true,
        })
    ],
    resolve: {
        alias: {
            '@': '/resources/js',
        },
    },
});
