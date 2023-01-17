import meow from 'meow';
import notifier from 'update-notifier';
import main from './src/index.js';

var cmd = meow(
  `
  Usage: discord_deploy deploy [options]\n
  Options:
    -d, --debug  run in debug mode. (default: false)
    --cwd <dir>  Absolute directory to searches for. (default: ${process.cwd()})
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
  pkg: {
    name: cmd.pkg.name,
    version: cmd.pkg.version
  },
  updateCheckInterval: 0,
  shouldNotifyInNpmScript: true
}).notify({
  message:
    'Version {latestVersion} is now Available!\n Run `{updateCommand}@latest` to update.',
  defer: false
});

if (cmd.input.some(stdin => stdin === 'deploy')) main(cmd.flags);
