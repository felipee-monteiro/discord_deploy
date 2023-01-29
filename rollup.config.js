import shebang from 'rollup-plugin-add-shebang';
import esbuild from 'rollup-plugin-esbuild';

export default {
  input: 'cli.js',
  output: {
    dir: 'bin',
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
  ],
  plugins: [
    shebang(),
    esbuild({
      include: './cli.js',
      minify: true,
      target: 'es2020',
      platform: 'node'
    })
  ]
};
