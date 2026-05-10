#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const dist = path.join(root, 'dist');
const manifest = {
  name: 'kob-node-fields',
  builtAt: new Date().toISOString(),
  entry: 'src/node-fields-server.js',
  command: 'npm run node:fields',
  endpoints: ['/health', '/fields', '/context', '/commands', '/logs', '/cadial', '/core', '/pulse', '/phi', '/ui']
};

fs.mkdirSync(dist, { recursive: true });
fs.writeFileSync(path.join(dist, 'node-fields-manifest.json'), JSON.stringify(manifest, null, 2) + '\n', 'utf8');
console.log('NODE.FIELDS build selado em dist/node-fields-manifest.json');
