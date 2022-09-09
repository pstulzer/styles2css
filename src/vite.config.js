// vite.config.js
import {defineConfig} from 'vite'
import {viteSingleFile} from "vite-plugin-singlefile"

export default defineConfig({
    build: {
        outDir: '../dist',
        emptyOutDir: false
    },
    server: {
        open: true,
        fs: {
            // Allow serving files from one level up to the project root
            allow: ['..']
        }
    },
    plugins: [viteSingleFile()]
});
