const { program } = require('commander');
const { version, name } = require('./package.json');
const deploy = require('./src/index.js');

program
  .name(name)
  .description('Utility to deploy discord slash commands easily.')
  .version(`${name}, version ${version}.`);
program.showSuggestionAfterError(true);
program.addHelpCommand('--help', 'Displays CLI help.');
program
  .command('scan')
  .description('Scan and deploy files.')
  .action(deploy);
program.parse();
