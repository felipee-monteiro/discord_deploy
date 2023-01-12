import { program, createCommand, Argument } from 'commander';
import { __dirname } from './src/utils.mjs';
import deploy from './src/index.mjs';
import * as cli from './package.json' assert { type: 'json' };

program
  .name(cli.default.name)
  .description(cli.default.description)
  .version(`${cli.default.name}@${cli.default.version}.`);
program.addHelpCommand('--help', 'CLI help.');
program.showSuggestionAfterError(true);
program
  .command('deploy')
  .alias('d')
  .option('-d, --debug', 'run in debug mode.', false)
  .option('--cwd <dir>', 'directory to searches for.', process.cwd())
  .description('Scan and deploy files.')
  .action(deploy);

program.parse();
