import { program, Argument } from 'commander';
import { _log } from './src/utils.js';
import deploy from './src/index.js';
import * as cli from './package.json' assert { type: 'json' };

program
  .name(cli.name)
  .description(cli.description)
  .version(`${cli.name}@${cli.version}.`);
program.option('-d, --debug', 'run in debug mode.');
program.showSuggestionAfterError(true);
program.addHelpCommand('--help', 'Displays CLI help.');
program
  .command('scan')
  .alias('s')
  .description('Scan and deploy files with debug mode (defaults to false). ')
  .action(() => deploy());
program.parse(process.argv);
