import notifier from 'update-notifier';
import { program, Command } from 'commander';
import deploy from './src/index.js';
import * as cli from './package.json' assert { type: 'json' };

const { name, version, description } = cli.default;

notifier({
  pkg: {
    name,
    version
  },
  updateCheckInterval: 0
}).notify();

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
      .description(
        'Deploy your commands files by searching for "commands" directory in your project. (ATTENTION: Needs "TOKEN" variable in .env)'
      )
      .action(deploy)
  ).parse(process.argv);
