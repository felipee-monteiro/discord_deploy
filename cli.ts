#!/usr/bin/env node
import { cac, CAC } from "cac";
import { main } from "./src";
import { cwd } from "node:process";
import { version } from "./package.json";

const cli: CAC = cac("discord_deploy");

cli
  .command("deploy")
  .action(main)
  .option("debug", "run in debug mode.", {
    default: false,
  })
  .option("cwd <dir>", "Absolute directory to search for.", {
    default: cwd(),
    type: ["string"],
  })
  .option("test", "Enables test mode.", {
    default: false,
  });
cli.help();
cli.version(version);
cli.parse();
