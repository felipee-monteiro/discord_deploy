import meow from 'meow';
import boxen from 'boxen';
import notifier from 'update-check';
import utils from './src/utils.js';
import main from './src/index.js';

const cmd = meow(
  `\nUsage: discord_deploy deploy [options]\n\nOptions:\n-d, --debug  run in debug mode. (default: false)\n--cwd <dir>  Absolute directory to search for. (default: ${process.cwd()}\n--testEnables test mode (Requires GUILD_TEST_ID env key). (default: false)\n--help   display CLI Help.`,
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
  const isUpdated = await notifier(cmd.pkg, { interval: 2000 });
  if (isUpdated) {
    console.debug(
      boxen(
        `${isUpdated.latest} is now avaliable !\nRun 'npm install discord_deploy@latest' to update.`,
        {
          padding: 1,
          margin: 1
        }
      )
    );
  }
} catch (e) {
  utils._log(e, 'error');
}

if (cmd.input.length && cmd.input.some(stdin => stdin === 'deploy')) {
  main(cmd.flags);
} else {
  utils.spinner().info('Use --help to show menu.');
  process.exit(0);
}
