import shebang from 'rollup-plugin-add-shebang';
export default {
  input: './bin/cli.js',
  output: {
    dir: 'bin',
    plugins: [shebang()],
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
    'node:process',
    'node:url',
    'node-fetch',
    'boxen',
    'dotenv',
    'meow',
    'ansi-styles',
    'normalize-path',
    'lodash.foreach',
    'ora',
    'update-check'
  ]
};
