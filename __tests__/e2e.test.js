import test from 'ava';
import { promisify } from 'node:util';
import { exec } from 'node:child_process';
import * as cli from '../package.json' assert { type: 'json' };

const execAsync = promisify(exec);
const { version } = cli.default;

async function execCLI (flags) {
  return Array.isArray(flags) && flags.length
    ? await execAsync('npx tsx cli.ts ' + flags.join(' '))
    : await execAsync('npx tsx cli.ts');
}

test('should not show version number;', async function (t) {
  const cmd = await execCLI(['-z']);
  if (cmd.stdout === '' && cmd.stderr === '') t.pass();
  else t.fail();
});

test('should show version number;', async function (t) {
  const { stdout, stderr } = await execCLI(['--version']);
  if (stderr) t.fail();
  t.is(stdout, `discord_deploy/${version} win32-x64 node-v18.13.0\n`);
});

test('should show help menu;', async function (t) {
  const cmd = await execCLI(['--help']);
  if (cmd.stderr) t.fail('Help menu: stderr eecuted.');
  t.is(
    cmd.stdout,
    `discord_deploy/${version}\n` +
      '\n' +
      'Usage:\n' +
      '  $ discord_deploy <command> [options]\n' +
      '\n' +
      'Commands:\n' +
      '  deploy  \n' +
      '\n' +
      'For more info, run any command with the `--help` flag:\n' +
      '  $ discord_deploy deploy --help\n' +
      '\n' +
      'Options:\n' +
      '  -h, --help     Display this message \n' +
      '  -v, --version  Display version number \n'
  );
});

test('should not throws an error', async function (t) {
  await t.notThrowsAsync(execCLI(['deploy', '--test']));
});

test('should throws an error: command dir not found, or files are not valid.', async function (t) {
  await t.throwsAsync(
    execCLI(['deploy', '--cwd hdhdhsdhsadds\\kjsdksadas\\sjakdadhj']),
    {
      instanceOf: Error,
      message: `Command failed: npx tsx cli.ts deploy --cwd hdhdhsdhsadds\\kjsdksadas\\sjakdadhj\n✖ An error was ocurred. use --debug to see the details.\n`
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

test('should render RETRY_AFTER', async t => {
  for (let i = 0; i < 2; i++) {
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
