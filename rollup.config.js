import os from 'node:os';
import terser from '@rollup/plugin-terser';
import shebang from 'rollup-plugin-add-shebang';

export default {
  input: './cli.js',
  output: {
    dir: 'bin',
    inlineDynamicImports: true
  },
  external: [
    'meow',
    'ora',
    'discord-api-types/v10',
    '@discordjs/rest',
    'fast-glob',
    'ansi-styles',
    'node:url',
    'dotenv',
    'normalize-path',
    'node:path',
    'update-notifier'
  ],
  plugins: [
    terser({ maxWorkers: os.cpus().length, toplevel: true }),
    shebang()
  ]
};
