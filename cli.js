import meow from 'meow';
import notifier from 'simple-update-notifier';
import utils from './src/utils.js';
import main from './src/index.js';

var cmd = meow(
  `
  Usage: discord_deploy deploy [options]\n
  Options:
    -d, --debug  run in debug mode. (default: false)
    --cwd <dir>  Absolute directory to search for. (default: ${process.cwd()})
    --test       Enables test mode (Requires GUILD_TEST_ID env key). (default: false)
    -h, --help   display CLI Help.
 `,
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

notifier({
  pkg: cmd.pkg,
  updateCheckInterval: 0
});

if (cmd.input.length && cmd.input.some(stdin => stdin === 'deploy')) {
  main(cmd.flags);
} else {
  utils.spinner().fail('Use --help to show menu.');
}
