import shebang from 'rollup-plugin-add-shebang';

export default {
  input: 'cli.js',
  output: {
    dir: 'bin',
    plugins: [shebang()],
    generatedCode: {
      objectShorthand: true
    }
  },
  treeshake: {
    preset: 'smallest'
  },
  external: [
    'node_modules',
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
