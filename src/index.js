import { resolve, relative } from 'node:path';
import process from 'node:process';
import glob from 'fast-glob';
import forEach from 'lodash.foreach';
import normalize from 'normalize-path';
import { config } from 'dotenv';
import fetch from 'node-fetch';
import utils from './utils.js';

const { _log, __dirname, spinner } = utils;
const loadingSpinner = spinner('Deploying your files...');
export const commandsData = [];

export async function importCommandFiles (filePath) {
  if (typeof filePath === 'string' && filePath.length) {
    const fileRequired = await import(
      normalize(relative(__dirname, filePath))
    ).then(module => module.default);
    _log('Processing: ' + filePath);
    if ('name' in fileRequired && 'description' in fileRequired) {
      commandsData.push(fileRequired);
    } else if ('data' in fileRequired && 'toJSON' in fileRequired.data) {
      commandsData.push(fileRequired.data.toJSON());
    } else {
      _log(`File not valid: ${filePath}`, 'warn');
    }
  } else {
    throw new TypeError(
      `filePath must be a String. Received: ${typeof filePath}`
    );
  }
}

export async function deploy (isTestEnabled) {
  const guild_id =
    isTestEnabled && 'GUILD_TEST_ID' in process.env
      ? process.env['GUILD_TEST_ID']
      : process.env['GUILD_ID'];
  if (guild_id && commandsData.length) {
    try {
      loadingSpinner.start();
      const res = await fetch(
        `https://discord.com/api/v10/applications/${process.env['CLIENT_ID']}/guilds/${guild_id}/commands`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bot ${process.env['TOKEN']}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(commandsData)
        }
      ).then(async response => ({
        body: await response.json(),
        code: response.status,
        statusText: response.statusText
      }));
      if (res.code === 200) {
        forEach(res.body, ({ name }) =>
          loadingSpinner.succeed('Deployed: /' + name)
        );
        loadingSpinner.stop();
        process.exit(0);
      } else if ('retry_after' in res.body && res.body['retry_after'] !== 0) {
        loadingSpinner.warn(
          `RATE_LIMIT_EXCEDED (https://discord.com/developers/docs/topics/rate-limits#rate-limits)\nTry again in ${Math.floor(
            res.body.retry_after
          )} seconds.`
        );
      } else {
        loadingSpinner.stop();
        if (res.code === 400) {
          const formErrors = res.body['errors'];
          forEach(Object.keys(formErrors), key =>
            forEach(formErrors[key]['_errors'], msg =>
              _log(msg.message, 'error')
            )
          );
        }
        _log(`REQUEST_FAILED[${res.code}]`, 'error');
      }
    } catch (e) {
      loadingSpinner.stop();
      _log('FATAL: ' + e, 'error');
    }
  } else {
    _log(
      'PLease verify your .env file, and if "commands" directory exists anywhere in your project with valid commands files',
      'error'
    );
    return false;
  }
}

export async function getCommandFiles (options) {
  const files = glob.stream('**/commands/**/*.{js,cjs,mjs}', {
    cwd: options.cwd,
    absolute: true
  });
  files.on('data', async filePath => {
    files.pause();
    await importCommandFiles(filePath.toString());
    files.resume();
  });
  files.on('error', error => _log(error, 'error'));
  files.on('end', async () => await deploy(options.test));
}

export async function main (options) {
  if (typeof options === 'object' && Object.keys(options).length) {
    config({
      path: resolve(options.cwd, '.env'),
      debug: options.debug
    });
    await getCommandFiles(options);
  } else {
    throw new TypeError(
      'Options must be an object, or have one or more key(s).'
    );
  }
}
