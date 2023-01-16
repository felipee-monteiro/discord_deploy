import meow from 'meow';
import notifier from 'update-notifier';
import deploy from './src/index.js';

var cmd = meow(`
  Usage: discord_deploy deploy [options]

  Deploy your commands files by searching for "commands" directory in your project. (ATTENTION: Needs "TOKEN", "CLIENT_ID" and "GUILD_ID" variables in .env)

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

var { name, version, description } = cmd.pkg;

notifier({
  pkg: {
    name,
    version
  },
  updateCheckInterval: 0
}).notify({
  message:
    'New Version is now Available!\n {currentVersion} -> {latestVersion}\n Run `{updateCommand}@latest` to update.'
});

if (cmd.input.some(stdin => stdin === 'deploy')) await deploy(cmd.flags);