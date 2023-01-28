import meow from 'meow';
import utils from './src/utils.js';
import { main } from './src/index.js';

const cmd = meow(
  `\nUsage: discord_deploy deploy [options]\n\nOptions:\n-d, --debug  run in debug mode. (default: false)\n--cwd <dir>  Absolute directory to search for. (default: ${process.cwd()})\n--test Enables test mode (Requires GUILD_TEST_ID env key). (default: false)\n--help   display CLI Help.`,
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

if (cmd.input.length && cmd.input.some(stdin => stdin === 'deploy')) {
  main(cmd.flags);
} else {
  utils.spinner().info('Use --help to show menu.');
  process.exit(0);
}
