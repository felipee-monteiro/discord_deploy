#!/usr/bin/env node
import { cac, CAC } from 'cac';
import { main } from './src/index.js';

const cli: CAC = cac('discord_deploy');

cli
  .command('deploy')
  .action(argvs => main(argvs))
  .option('debug', 'run in debug mode.', {
    default: false
  })
  .option('cwd', 'Absolute directory to search for.', {
    default: process.cwd()
  })
  .option('test', 'Enables test mode (Requires GUILD_TEST_ID env key).', {
    default: false
  })
  .option('help', 'shows helps menu');
cli.parse();