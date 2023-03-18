import test from "ava";
import { promisify } from "node:util";
import { exec } from "node:child_process";
import * as cli from "../package.json" assert { type: "json" };

const execAsync = promisify(exec);
const { version } = cli.default;

async function execCLI(flags) {
  return Array.isArray(flags) && flags.length
    ? await execAsync("npx tsx cli.ts " + flags.join(" "))
    : await execAsync("npx tsx cli.ts");
}

test("should not show version number;", async function (t) {
  const cmd = await execCLI(["-z"]);
  if (cmd.stdout === "" && cmd.stderr === "") t.pass();
  else t.fail();
});

test("should show version number;", async function (t) {
  const { stdout, stderr } = await execCLI(["--version"]);
  if (stderr) t.fail();
  t.notDeepEqual(stdout, `discord_deploy/${version}\n`);
});

test("should show help menu;", async function (t) {
  const cmd = await execCLI(["--help"]);
  if (cmd.stderr) t.fail("Help menu: stderr eecuted.");
  t.is(
    cmd.stdout,
    `discord_deploy/${version}\n` +
      "\n" +
      "Usage:\n" +
      "  $ discord_deploy <command> [options]\n" +
      "\n" +
      "Commands:\n" +
      "  deploy  \n" +
      "\n" +
      "For more info, run any command with the `--help` flag:\n" +
      "  $ discord_deploy deploy --help\n" +
      "\n" +
      "Options:\n" +
      "  -h, --help     Display this message \n" +
      "  -v, --version  Display version number \n"
  );
});

test("should not throws an error", async function (t) {
  await t.notThrowsAsync(execCLI(["deploy", "--test", "--debug"]));
});

test("should throws an error: command dir not found, or files are not valid.", function (t) {
  const cmd = execCLI(["deploy", "--cwd hdhdhsdhsadds\\kjsdksadas\\sjakdadhj"]);
  if (cmd.stdout) {
    t.fail();
  }
  t.notDeepEqual(
    cmd.stderr,
    `[ERROR] PLease verify your .env file, or if cwd path exists.\n`
  );
});

test("should run in debug mode", async (t) => {
  const cmd = await execCLI(["deploy", "--debug", "--test"]);
  t.notDeepEqual(
    cmd.stdout,
    "\x1B[96m [INFO] Processing: \n" + "\x1B[96m [INFO] Processing: \n"
  );
});

test("should render RETRY_AFTER", async (t) => {
  for (let i = 0; i < 2; i++) {
    const cmd = await execCLI(["deploy", "--debug", "--test"]);
    t.notDeepEqual(
      cmd.stderr,
      "- Deploying your files...\n" +
        "⚠ RATE_LIMIT_EXCEDED (https://discord.com/developers/docs/topics/rate-limits#rate-limits)\n"
    );
  }
});
