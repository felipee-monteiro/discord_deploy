import shebang from 'rollup-plugin-add-shebang';
export default {
  input: 'cli.js',
  compress: true,
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
