import { program, createCommand, Argument } from 'commander';
import deploy from './src/index.js';
import * as cli from './package.json' assert { type: 'json' };

program
  .name(cli.default.name)
  .description(cli.default.description)
  .version(`${cli.default.name}@${cli.default.version}.`);
program.addHelpCommand('--help', 'CLI help.');
program
  .command('deploy')
  .alias('d')
  .option('-d, --debug', 'run in debug mode.', false)
  .option('--cwd <dir>', 'Absolute directory to searches for.', process.cwd())
  .option(
    '--test',
    'Enables test mode (Requires GUILD_TEST_ID env key).',
    false
  )
  .description('Scan and deploy files.')
  .action(deploy);
program.parse();
