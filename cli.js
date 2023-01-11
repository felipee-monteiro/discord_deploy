const { program, Argument } = require('commander');
const { _log } = require('./src/utils.js');
const { version, name } = require('./package.json');
const deploy = require('./src/index.js');

program
  .name(name)
  .description('Utility to deploy discord slash commands easily.')
  .version(`${name}@${version}.`);
program.option('-d, --debug', 'run in debug mode.');
program.showSuggestionAfterError(true);
program.addHelpCommand('--help', 'Displays CLI help.');
program
  .command('scan')
  .alias('s')
  .description('Scan and deploy files with debug mode (defaults to false). ')
  .action(deploy);
program.parse(process.argv);
