// vite.config.js
import {resolve} from 'path'
import {defineConfig} from 'vite'

export default defineConfig({
    build: {
        outDir: "../../dist",
        sourcemap: false,
        lib: {
            entry: resolve(__dirname, 'index.js'),
            fileName: 'code',
            formats: ['es']
        },
        rollupOptions: {
            output: {
                preferConst: true,
                generatedCode: {
                    arrowFunctions: true
                }
            }
        },
        emptyOutDir: false
    }
});
