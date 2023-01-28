import test from 'ava';
import { promisify } from 'node:util';
import { exec } from 'node:child_process';
import * as cli from '../package.json' assert { type: 'json' };

const execAsync = promisify(exec);
const { version } = cli.default;

async function execCLI (flags) {
  return Array.isArray(flags) && flags.length
    ? await execAsync('node cli ' + flags.join(' '))
    : await execAsync('node cli.js');
}

test('should not show version number;', async function (t) {
  const cmd = await execCLI(['-version']);
  if (cmd.stdout) {
    t.notDeepEqual(
      cmd.stdout,
      '\n' +
        '   ┌────────────────────────────────────────────────────────┐\n' +
        '   │                                                        │\n' +
        '   │   1.0.11 is now avaliable !                            │\n' +
        '   │   Run "npm install discord_deploy@latest" to update.   │\n' +
        '   │                                                        │\n' +
        '   └────────────────────────────────────────────────────────┘\n' +
        '\n'
    );
  }
  t.notDeepEqual(cmd.stderr, 'Use --help to show menu.\n');
});

test('should show version number;', async function (t) {
  const { stdout, stderr } = await execCLI(['--version']);
  if (stderr) t.fail();
  t.is(stdout, `${cli.default.version}\n`);
});

test('should show help menu;', async function (t) {
  const cmd = await execCLI(['--help']);
  if (cmd.stderr) t.fail('Help menu: stderr eecuted.');
  t.is(
    cmd.stdout,
    '\n' +
      '  A CLI to deploy slash guild commands easily.\n' +
      '\n' +
      '  Usage: discord_deploy deploy [options]\n' +
      '\n' +
      '  Options:\n' +
      '  -d, --debug  run in debug mode. (default: false)\n' +
      '  --cwd <dir>  Absolute directory to search for. (default: C:\\Users\\Felipe\\Desktop\\projects\\www\\nodejs\\discord_deploy)\n' +
      '  --test Enables test mode (Requires GUILD_TEST_ID env key). (default: false)\n' +
      '  --help   display CLI Help.\n' +
      '\n'
  );
});

test('should not show help menu', async function (t) {
  const cmd = await execCLI(['-help']);
  if (cmd.stdout) {
    t.assert(
      cmd.stdout,
      '\n' +
        '   ┌────────────────────────────────────────────────────────┐\n' +
        '   │                                                        │\n' +
        '   │   1.0.11 is now avaliable !                            │\n' +
        '   │   Run "npm install discord_deploy@latest" to update.   │\n' +
        '   │                                                        │\n' +
        '   └────────────────────────────────────────────────────────┘\n' +
        '\n'
    );
  }
  t.notDeepEqual(cmd.stderr, 'Use --help to show menu.\n');
});

test('should not throws an error', async function (t) {
  await t.notThrowsAsync(execCLI(['deploy', '--test']));
});

test('should throws an error: command dir not found, or files are not valid.', async function (t) {
  await t.throwsAsync(
    execCLI(['deploy', '--cwd hdhdhsdhsadds\\kjsdksadas\\sjakdadhj']),
    {
      instanceOf: Error,
      message:
        'Command failed: node cli deploy --cwd hdhdhsdhsadds\\kjsdksadas\\sjakdadhj\n✖ An error was ocurred. use --debug to see the details.\n',
      code: 1
    }
  );
});

test('should run in debug mode', async t => {
  const cmd = await execCLI([
    'deploy',
    '--debug',
    '--cwd C:\\Users\\Felipe\\Desktop\\projects\\www\\nodejs\\disc_bot',
    '--test'
  ]);
  t.is(
    cmd.stdout,
    '\x1B[96m [INFO] Processing: C:/Users/Felipe/Desktop/projects/www/nodejs/disc_bot/server/commands/github/index.js \x1B[39m\n' +
      '\x1B[96m [INFO] Processing: C:/Users/Felipe/Desktop/projects/www/nodejs/disc_bot/server/commands/github/login.js \x1B[39m\n' +
      '\x1B[96m [INFO] Processing: C:/Users/Felipe/Desktop/projects/www/nodejs/disc_bot/server/commands/github/selectCronDay.js \x1B[39m\n' +
      '\x1B[96m [INFO] Processing: C:/Users/Felipe/Desktop/projects/www/nodejs/disc_bot/server/commands/github/selectRepoCommand.js \x1B[39m\n' +
      '\x1B[96m [INFO] Processing: C:/Users/Felipe/Desktop/projects/www/nodejs/disc_bot/server/commands/github/user.js \x1B[39m\n'
  );
});

test('should not accept cwd', async t => {
  await t.throwsAsync(execCLI(['deploy', '--cwd djfkhsjkfskfksdkfdlfh']), {
    instanceOf: Error,
    message:
      'Command failed: node cli deploy --cwd djfkhsjkfskfksdkfdlfh\n✖ An error was ocurred. use --debug to see the details.\n',
    code: 1
  });
});

test('should render RETRY_AFTER', async t => {
  for (let i = 0; i < 3; i++) {
    const cmd = await execCLI([
      'deploy',
      '--debug',
      '--cwd C:\\Users\\Felipe\\Desktop\\projects\\www\\nodejs\\disc_bot',
      '--test'
    ]);
    t.notDeepEqual(
      cmd.stderr,
      '- Deploying your files...\n' +
        '⚠ RATE_LIMIT_EXCEDED (https://discord.com/developers/docs/topics/rate-limits#rate-limits)\n'
    );
  }
});
