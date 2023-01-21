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
  const { stdout, stderr } = await execCLI(['-version']);
  if (stdout) t.fail();
  t.notDeepEqual(stderr, 'Use --help to show menu.\n');
});

test('should show version number;', async function (t) {
  const { stdout, stderr } = await execCLI(['--version']);
  if (stderr) t.fail();
  t.is(stdout, `${cli.default.version}\n`);
});

test('should show help menu;', async function (t) {
  const { stdout, stderr } = await execCLI(['--help']);
  if (stderr) t.fail('Help menu: stderr eecuted.');
  t.is(
    stdout,
    '\n' +
      "  A CLI to deploy slash guild commands easily by searching for 'commands' directory in your project. Needs 'TOKEN', 'CLIENT_ID' and 'GUILD_ID' variables in .env.\n" +
      '\n' +
      '  Usage: discord_deploy deploy [options]\n' +
      '\n' +
      '  Options:\n' +
      '  -d, --debug  run in debug mode. (default: false)\n' +
      '  --cwd <dir>  Absolute directory to search for. (default: C:\\Users\\Felipe\\Desktop\\projects\\www\\nodejs\\discord_deploy\n' +
      '  --testEnables test mode (Requires GUILD_TEST_ID env key). (default: false)\n' +
      '  --help   display CLI Help.\n' +
      '\n'
  );
});

test('should not show help menu', async function (t) {
  const { stdout, stderr } = await execCLI(['-help']);
  if (stdout) t.fail();
  t.notDeepEqual(stderr, 'Use --help to show menu.\n');
});

test('should not throws an error', async function (t) {
  const { stdout, stderr } = await execCLI(['deploy', '--test']);
  t.notDeepEqual(stdout, 'Deployed');
});

test('should throws "commands dir not found"', async function (t) {
  await execCLI(['deploy', '--cwd jkdksdhfksdhfkjsdhfskdfjsdfh']).catch(e => {
    t.is(1, e.code);
  });
});

test('should throws an error: command dir not found, or files are not valid.', async function (t) {
  const { stdout, stderr } = await execCLI([
    'deploy',
    '--cwd hdhdhsdhsadds\\kjsdksadas\\sjakdadhj'
  ]).catch(e =>
    t.notDeepEqual(e, 'An error was ocurred. use --debug the see the details.')
  );
});
