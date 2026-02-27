#!/usr/bin/env node

const esbuild = require('esbuild');
const path = require('path');
const fs = require('fs');

const isWatch = process.argv.includes('--watch');

const buildOptions = {
  entryPoints: [path.join(__dirname, '../src/cli.ts')],
  bundle: true,
  platform: 'node',
  target: 'node18',
  outfile: path.join(__dirname, '../dist/cli.js'),
  banner: {
    js: '#!/usr/bin/env node',
  },
  external: [
    // Native modules that can't be bundled
    'node-pty',
    // Express and its dependencies
    'express',
    'express-ws',
    'ws',
    // Open package
    'open',
  ],
  minify: false,
  sourcemap: false,
};

async function copyClient() {
  const clientSrc = path.join(__dirname, '../../client/dist');
  const clientDest = path.join(__dirname, '../client');

  // Remove old client directory
  if (fs.existsSync(clientDest)) {
    fs.rmSync(clientDest, { recursive: true });
  }

  // Copy client dist if it exists
  if (fs.existsSync(clientSrc)) {
    fs.cpSync(clientSrc, clientDest, { recursive: true });
    console.log('✓ Copied client files');
  } else {
    console.warn('⚠ Client dist not found. Run "pnpm build" in root first.');
  }
}

async function build() {
  try {
    // Build CLI
    await esbuild.build(buildOptions);
    console.log('✓ Built CLI');

    // Copy client files
    await copyClient();

    console.log('\nBuild complete!');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

if (isWatch) {
  esbuild.context(buildOptions).then(ctx => ctx.watch());
} else {
  build();
}
