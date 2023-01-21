import meow from 'meow';
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

await notifier(cmd.pkg, { interval: 2000 }).then(success => {
  success ??
    console.debug(
      `\n\n\t\t${success.latest} is now avaliable !\n\tRun 'npm install discord_deploy@latest' to update.\n\n`
    );
});

if (cmd.input.length && cmd.input.some(stdin => stdin === 'deploy')) {
  main(cmd.flags);
} else {
  utils.spinner().info('Use --help to show menu.');
  process.exit(0);
}
