const esbuild = require('esbuild');
// sandbox

esbuild
    .build({
        entryPoints: ['src/code.ts'],
        bundle: true,
        platform: 'node',
        target: ['node12.20.1'],
        outfile: 'dist/code.js'
    })
    .catch(() => process.exit(1));
