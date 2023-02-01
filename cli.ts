#!/usr/bin/env node
import { cac, CAC } from 'cac';
import { main } from './src';
import type { Options } from './src/types';
import { version } from './package.json';

const cli: CAC = cac('discord_deploy');

cli
  .command('deploy')
  .action((argvs: Options) => main(argvs))
  .option('debug', 'run in debug mode.', {
    default: false
  })
  .option('cwd <dir>', 'Absolute directory to search for.', {
    default: process.cwd()
  })
  .option('test', 'Enables test mode (Requires GUILD_TEST_ID env key).', {
    default: false
  });
cli.help();
cli.version(version);
cli.parse();
