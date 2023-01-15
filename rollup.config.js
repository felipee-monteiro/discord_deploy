import os from 'node:os';
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';

export default {
  input: './cli.js',
  output: {
    dir: 'bin',
    format: 'es'
  },
  external: [
    'commander',
    'discord-api-types/v10',
    '@discordjs/rest',
    'fast-glob',
    'ansi-styles',
    'node:url',
    'dotenv',
    'normalize-path',
    'node:path'
  ],
  plugins: [
    json({ compact: true }),
    terser({ maxWorkers: os.cpus().length, toplevel: true })
  ]
};
