import { resolve, join, basename } from 'node:path';
import { existsSync } from 'node:fs';
import { readFile, writeFile, cp, mkdir, rm } from 'node:fs/promises';
import { defineConfig } from 'vite';
import { transform } from 'esbuild';
import mkcert from 'vite-plugin-mkcert';
import fs from 'node:fs';
import archiver from "archiver"

import pkg from './package.json';
const PENGU_PATH = pkg.config.penguPath;
const PLUGIN_NAME = pkg.name;

const getIndexCode = (port: number) => (
    `await import('https://localhost:${port}/@vite/client');
  export * from 'https://localhost:${port}/src/index.ts';`
);

let port: number;
const outDir = resolve(__dirname, 'dist');
const pluginsDir = resolve(__dirname, PENGU_PATH, 'plugins', PLUGIN_NAME);

async function emptyDir(path: string) {
    if (existsSync(path)) {
        await rm(path, { recursive: true });
    }
    await mkdir(path, { recursive: true });
}

export default defineConfig((config) => ({
    define: {
        'process.env.ENV': config.command == 'build' ? '"production"' : '"development"',
        'process.env.PROD': config.command == 'build' ? 'true' : 'false',
        'process.env.DEV': config.command == 'build' ? 'false' : 'true',
    },
    build: {
        target: 'esnext',
        minify: true,
        cssMinify: true,
        rollupOptions: {
            output: {
                format: 'esm',
                entryFileNames: 'index.js',
                manualChunks: undefined,
                assetFileNames(name) {
                    if (name.name === 'style.css')
                        return 'index.css';
                    return 'assets/[name]-[hash][extname]';
                }
            },
            preserveEntrySignatures: 'strict',
            treeshake: 'smallest',
        },
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            fileName: 'index',
            formats: ['es'],
        },
    },
    server: {
        https: true,
        // port: 3000
    },
    publicDir: false,
    plugins: [
        mkcert(),
        {
            // Because vite doesn't allow minifying of ESM, we have to do it manually
            name: 'minify',
            apply: 'build',
            enforce: 'post',
            renderChunk: {
                order: 'post',
                async handler(code, chunk, _) {
                    if (chunk.fileName.endsWith('.js')) {
                        return await transform(code, { minify: true, treeShaking: true });
                    }

                    return code;
                }
            }
        },
        {
            name: 'pengu-serve',
            apply: 'serve',
            enforce: 'post',
            configureServer(server) {
                server.httpServer!.once('listening', async () => {
                    // @ts-ignore
                    port = server.httpServer.address()['port'];
                    await emptyDir(pluginsDir);
                    await writeFile(join(pluginsDir, 'index.js'), getIndexCode(port));
                });
            },
            transform: (code, id) => {
                if (/\.(ts|tsx|js|jsx)$/i.test(id)) return;
                return code.replace(/\/src\//g, `https://localhost:${port}/src/`)
            },
        },
        {
            name: 'pengu-build',
            apply: 'build',
            enforce: 'post',
            async closeBundle() {
                const indexJs = join(outDir, 'index.js');
                let count = 0;

                let jsCode = (await readFile(indexJs, 'utf-8'))
                    // Patch asset URLs
                    .replace(/\"\/assets\//g, `"//plugins/${PLUGIN_NAME}/assets/`)

                if (existsSync(join(outDir, 'index.css'))) {
                    const indexCss = join(outDir, 'index.css');

                    const cssCode = (await readFile(indexCss, 'utf-8'))
                        // Patch asset URLs
                        .replace(/url\(\/assets\//g, `url(./assets/`);
                    await writeFile(indexCss, cssCode);

                    jsCode = jsCode
                        // Import CSS module
                        .replace(/^/, 'import "./index.css";');
                }

                await writeFile(indexJs, jsCode);

                // Copy assets and config folder to dist
                let copy = setInterval(()=> {
                    count += 100;
                }, 100)
                await cp(resolve(__dirname, 'src/src/assets'), outDir+"/assets", {
                    recursive: true,
                });
                await cp(resolve(__dirname, 'src/src/config'), outDir+"/config", {
                    recursive: true,
                });
                console.log(`Copying assets and configs folder to /dist completed! (%cin ${count/1000}s%c)`, "color: #f77fbe", "");
                clearInterval(copy);
                count = 0

                // Copy cdn folder if have
                copy = setInterval(()=> {
                    count += 100;
                }, 100)
                try {
                    await cp(resolve(__dirname, 'src/elaina-theme-data'), outDir+"/elaina-theme-data", {
                        recursive: true,
                    });
                    console.log(`Copying CDN folder to /dist completed! (%cin ${count/1000}s%c)`, "color: #f77fbe", "");
                    clearInterval(copy);
                    count = 0
                }
                catch {}

                // Zip plugins after complete
                const output = fs.createWriteStream(outDir+"/ElainaV4.zip");
                const archive = archiver('zip', {
                    zlib: { level: 9 }
                });

                archive.on('error', (err) => {
                    throw err;
                });

                output.on('close', () => {
                    console.log(`${archive.pointer()} total bytes`);
                    console.log('Zipping completed successfully!');
                });

                archive.pipe(output);

                archive.directory(outDir+"/assets", "assets");
                archive.directory(outDir+"/config", "config");
                archive.file(outDir+"/index.js", { name: basename(outDir+"/index.js") });

                archive.finalize();

                // Copy output to pengu dir
                copy = setInterval(()=> {
                    count += 100;
                }, 100)
                await emptyDir(pluginsDir);
                await cp(outDir, pluginsDir, {
                   recursive: true,
                });
                console.log(`Copying /dist to Pengu dir completed! (%cin ${count/1000}s%c)`, "color: #f77fbe", "");
                clearInterval(copy);
                count = 0
            }
        },
    ]
}));
