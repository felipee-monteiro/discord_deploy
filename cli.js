import meow from 'meow';
import colors from 'ansi-styles';
import notifier from 'update-check';
import utils from './src/utils.js';
import main from './src/index.js';

var cmd = meow(`\nUsage: discord_deploy deploy [options]\n\nOptions:\n-d, --debug  run in debug mode. (default: false)\n--cwd <dir>  Absolute directory to search for. (default: ${process.cwd()}\n--testEnables test mode (Requires GUILD_TEST_ID env key). (default: false)\n-h, --help   display CLI Help.`,
  {
    importMeta: import.meta,
    flags: {
      debug: {
        type: 'boolean',
        alias: '-d',
        default: false
      },
      cwd: {
        type: 'string',
        default: process.cwd()
      },
      test: {
        type: 'boolean',
        default: false
      }
    }
  }
);

try {
  await notifier(cmd.pkg, { interval: 2000 }).then(success => {
    if (success) {
      console.debug(`\n\n\t\t${success.latest} is now avaliable !\n\tRun 'npm install discord_deploy@latest' to update.\n\n`);
    }
  });
} catch (err) {
  console.error(`Failed to check for updates: ${err}`);
}

if (cmd.input.length && cmd.input.some(stdin => stdin === 'deploy')) {
  main(cmd.flags);
} else {
  utils.spinner().info('Use --help to show menu.');
  process.exit(0);
}
