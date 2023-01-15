#!/usr/bin/env node
import deploy from './src/index.js';
import { program, Command } from 'commander';
import * as cli from './package.json' assert { type: 'json' };

const {
  default: { name, version, description }
} = cli;

program
  .name(name)
  .version(version)
  .showSuggestionAfterError(false)  
  .addCommand(
    new Command('deploy')
      .option('-d, --debug', 'run in debug mode.', false)
      .option(
        '--cwd <dir>',
        'Absolute directory to searches for.',
        process.cwd()
      )
      .option(
        '--test',
        'Enables test mode (Requires GUILD_TEST_ID env key).',
        false
      )
      .description('Deploy your commands files (Needs "TOKEN" variable in .env)')
      .action(deploy)
  )
  .parse(process.argv);
