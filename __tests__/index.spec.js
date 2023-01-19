import test from 'ava';
import { promisify } from 'node:util';
import { exec } from 'node:child_process';
import * as cli from '../package.json' assert { type: 'json' };

const execAsync = promisify(exec);

async function execCLI (flags) {
  return Array.isArray(flags) && flags.length
    ? await execAsync('node cli ' + flags.join(' '))
    : await execAsync('node cli.js');
}

test('should not show version number;', async function (t) {
  const { stdout, stderr } = await execCLI(['-version']);
  if (stdout) t.fail();
  t.is(stderr, 'ℹ Use --help to show menu.\n');
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
      "  A CLI to deploy slash commands easily by searching for 'commands' directory in your project. Needs 'TOKEN', 'CLIENT_ID' and 'GUILD_ID' variables in .env.\n" +
      '\n' +
      '  Usage: discord_deploy deploy [options]\n' +
      '\n' +
      '  Options:\n' +
      '    -d, --debug  run in debug mode. (default: false)\n' +
      '    --cwd <dir>  Absolute directory to search for. (default: C:\\Users\\Felipe\\Desktop\\projects\\www\\nodejs\\discord_deploy)\n' +
      '    --test       Enables test mode (Requires GUILD_TEST_ID env key). (default: false)\n' +
      '    -h, --help   display CLI Help.\n' +
      ' \n' +
      '\n'
  );
});

test('should not show help menu', async function (t) {
  const { stdout, stderr } = await execCLI(['-help']);
  if (stdout) t.fail();
  t.is(stderr, 'ℹ Use --help to show menu.\n');
});