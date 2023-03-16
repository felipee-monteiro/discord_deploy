import { relative, resolve } from "node:path";
import { cwd, env, exit } from "node:process";
import glob from "fast-glob";
import forEach from "lodash.foreach";
import normalize from "normalize-path";
import { config } from "dotenv";
import fetch from "node-fetch";
import utils from "./utils";
import type {
  FetchDiscordError,
  SlashCommand,
  Options,
  SlashCommandResponse,
} from "./types";

const { _log, __dirname, spinner } = utils;
const loadingSpinner = spinner();
const commandsData: SlashCommand[] = [];

async function importCommandFiles(filePath: string): Promise<void> {
  if (filePath.length) {
    const fileRequired: SlashCommand = await import(
      normalize(relative(__dirname(import.meta.url), filePath))
    ).then((module) => module.default);
    _log("Processing: " + filePath);
    if (fileRequired.data) {
      commandsData.push(fileRequired.data.toJSON());
    } else if (fileRequired.name) {
      commandsData.push(fileRequired);
    } else {
      _log(`File Not Valid: ${filePath}`, "error");
    }
  } else {
    throw new TypeError(
      `filePath must be a Valid String. Received string length: ${filePath.length}`
    );
  }
}

async function deploy(isTestEnabled: boolean = false): Promise<boolean | void> {
  const guild_id =
    isTestEnabled && "GUILD_TEST_ID" in env
      ? env["GUILD_TEST_ID"]
      : env["GUILD_ID"];
  const botToken = env["BOT_TOKEN"];
  if (guild_id && commandsData.length && botToken) {
    try {
      loadingSpinner.start();
      const responseJSON = await fetch(
        `https://discord.com/api/v10/applications/${env["CLIENT_ID"]}/guilds/${guild_id}/commands`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bot ${botToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(commandsData),
        }
      ).then(
        (r): Promise<Array<SlashCommandResponse> | FetchDiscordError> =>
          // @ts-ignore
          r.status === 200
            ? // @ts-ignore
              r.json<Array<SlashCommandResponse>>()
            : // @ts-ignore
              r.json<FetchDiscordError>()
      );
      if (Array.isArray(responseJSON)) {
        forEach(responseJSON, (slashcmd: SlashCommandResponse) =>
          loadingSpinner.succeed("Deployed: /" + slashcmd.name)
        );
        loadingSpinner.stop();
        exit(0);
      } else if (responseJSON.retry_after) {
        loadingSpinner.warn(
          `RATE_LIMIT_EXCEDED (https://discord.com/developers/docs/topics/rate-limits#rate-limits)\nTry again in ${Math.floor(
            responseJSON.retry_after
          )} second(s).`
        );
      } else if (responseJSON.errors) {
        loadingSpinner.stop();
        const items = responseJSON.errors;
        forEach(Object.keys(items), (key: string): void => {
          forEach(items[key]["_errors"], (log) => _log(log.message, "error"));
        });
      } else _log(`REQUEST_FAILED`, "error");
    } catch (e) {
      loadingSpinner.stop();
      _log("FATAL: " + e, "error");
    }
  } else {
    _log(
      'PLease verify your env file, and if "commands" directory exists anywhere in your project with valid commands files',
      "error"
    );
    return false;
  }
}

async function getCommandFiles({ cwd, test }: Options): Promise<void> {
  const files = glob.stream("**/commands/**/*.{js,cjs,mjs}", {
    cwd,
    absolute: true,
  });
  files.on("data", async (filePath: Buffer) => {
    files.pause();
    await importCommandFiles(filePath.toString());
    files.resume();
  });
  files.on("error", (error) => _log(error, "error"));
  files.on("end", async () => await deploy(test));
}

async function main(options: Options): Promise<void> {
  const isLoaded = config({
    path: resolve(options.cwd || cwd(), ".env"),
    debug: options.debug,
  });
  if (isLoaded.error) {
    _log("PLease verify your .env file", "error");
  } else {
    await getCommandFiles(options);
  }
}

export { deploy, getCommandFiles, importCommandFiles, main };
