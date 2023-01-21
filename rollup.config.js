import os from 'node:os';
import terser from '@rollup/plugin-terser';
import shebang from 'rollup-plugin-add-shebang';
export default {
  input: './cli.js',
  output: {
    dir: 'bin',
    plugins: [terser({ maxWorkers: os.cpus().length }), shebang()],
    compact: true,
    generatedCode: {
      objectShorthand: true
    },
    minifyInternalExports: true,
  },
  treeshake: {
    preset: 'smallest'
  },
  external: [
    'fast-glob',
    'node:path',
    'node:url',
    'node-fetch',
    'dotenv',
    'meow',
    'ansi-styles',
    'normalize-path',
    'lodash.foreach',
    'ora',
    'update-check'
  ]
};
