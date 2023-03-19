import { resolve } from 'node:path';
import { env, exit } from 'node:process';
import { pathToFileURL } from 'node:url';
import { pathExists } from 'fs-extra';
import * as esbuild from 'esbuild';
import glob from 'fast-glob';
import forEach from 'lodash.foreach';
import map from 'lodash.map';
import { config } from 'dotenv';
import fetch from 'node-fetch';
import utils from './utils';
import type {
  FetchDiscordError,
  SlashCommand,
  Options,
  SlashCommandResponse,
} from './types';
import type { RESTPostAPIChatInputApplicationCommandsJSONBody } from 'discord.js';

const { _log, spinner } = utils;
const loadingSpinner = spinner();
let opt: Options = {};

async function buildCommandFiles(filePath: string): Promise<void> {
  if (filePath.length) {
    try {
      _log('Processing: ' + filePath);
      await esbuild.build({
        entryPoints: [filePath],
        allowOverwrite: true,
        target: 'node16',
        format: 'esm',
        bundle: true,
        minify: true,
        outdir: 'build',
        write: true,
        packages: 'external',
      });
    } catch (e: any) {
      _log(e.message, 'error');
    }
  } else {
    throw new TypeError('filePath must be Valid.');
  }
}

async function importCommandFiles() {
  const cmdFiles = await glob('build/**/*.js', {
    absolute: true,
    ignore: ['node_modules'],
  });
  const commandsData = await Promise.all(
    map(cmdFiles, async (filePath: string) => {
      const fileRequired: SlashCommand = await import(
        pathToFileURL(filePath).href
      ).then((module) => module.default);
      if (fileRequired.data) {
        return fileRequired.data.toJSON();
      } else if (fileRequired.name) {
        return fileRequired;
      }
    })
  );
  // @ts-ignore
  deploy(commandsData);
  return commandsData;
}

async function deploy(
  commandsData: (
    | SlashCommand
    | RESTPostAPIChatInputApplicationCommandsJSONBody
  )[]
): Promise<boolean | void> {
  const guild_id =
    opt.test && 'GUILD_TEST_ID' in env ? env['GUILD_TEST_ID'] : env['GUILD_ID'];
  const botToken = env['BOT_TOKEN'];

  if (guild_id?.length && commandsData.length && botToken?.length) {
    try {
      loadingSpinner.start();
      const responseJSON = await fetch(
        `https://discord.com/api/v10/applications/${env['CLIENT_ID']}/guilds/${guild_id}/commands`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bot ${botToken}`,
            'Content-Type': 'application/json',
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
          loadingSpinner.succeed('Deployed: /' + slashcmd.name)
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
          forEach(items[key]['_errors'], (log) => _log(log.message, 'error'));
        });
      } else {
        _log(`REQUEST_FAILED`, 'error');
      }
    } catch (e) {
      loadingSpinner.stop();
      _log('FATAL: ' + e, 'error');
    }
  } else {
    _log(
      'PLease verify your env file, and if "commands" directory exists anywhere in your project with valid commands files',
      'error'
    );
    return false;
  }
}

async function getCommandFiles(): Promise<void> {
  const files = glob.stream('**/commands/**/*.{js,cjs,mjs,ts}', {
    cwd: opt.cwd,
    absolute: true,
    ignore: ['node_modules'],
  });
  files.on('readable', async () => {
    files.pause();
    await buildCommandFiles(files.read().toString());
    files.resume();
  });
  files.on('error', (error) => _log(error, 'error'));
  files.on('end', importCommandFiles);
}

async function main(options: Options): Promise<boolean | void> {
  if (options.cwd && (await pathExists(options.cwd))) {
    const isLoaded = config({
      path: resolve(options.cwd, '.env'),
      debug: options.debug,
    });
    if (isLoaded.error) {
      _log('PLease verify your .env file.', 'error');
    } else {
      opt = Object.assign(options, opt);
      await getCommandFiles();
    }
  } else {
    _log('Please verify cwd.', 'error');
    throw new TypeError('Options is required.');
  }
}

export { deploy, getCommandFiles, buildCommandFiles, importCommandFiles, main };
