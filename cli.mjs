import { program, Argument } from 'commander';
import { _log } from './src/utils.mjs';
import deploy from './src/index.mjs';
import * as cli from './package.json' assert { type: 'json' };

program
  .name(cli.default.name)
  .description(cli.default.description)
  .version(`${cli.default.name}@${cli.default.version}.`);
program.option('-d, --debug', 'run in debug mode.');
program.showSuggestionAfterError(true);
program.addHelpCommand('--help', 'Displays CLI help.');
program
  .command('scan')
  .alias('s')
  .description('Scan and deploy files with debug mode (defaults to false). ')
  .action(() => deploy());
program.parse(process.argv);
