#!/usr/bin/env node
import { cac, CAC } from 'cac';
import { main } from './src';
import utils from './src/utils';
import { cwd, exit } from 'node:process';
import { version } from './package.json';
import { emptyDir } from 'fs-extra';

const cli: CAC = cac('discord_deploy');

cli
  .command('deploy')
  .option('--debug, -d', 'run in debug mode.', {
    default: false,
  })
  .option('cwd <dir>', 'Absolute directory to search for.', {
    default: cwd(),
  })
  .option('--test', 'Enables test mode.', {
    default: false,
  })
  .action(main);

cli.command('clear', 'clear esbuild cache.').action(async () => {
  try {
    const isEmpty = await emptyDir('build');
    // @ts-ignore
    if (isEmpty.length) utils._log('Cleaned successfully.', 'log');
    else utils._log('Already Cleaned.');
    exit(0);
  } catch (error: any) {
    utils._log(error.message, 'error');
    exit(1);
  }
});
cli.help();
cli.version(version);
cli.parse();
