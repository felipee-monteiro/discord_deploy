import glob from 'fast-glob';
import forEach from 'lodash.foreach';
import { resolve, relative } from 'node:path';
import normalize from 'normalize-path';
import { config } from 'dotenv';
import fetch from 'node-fetch';
import utils from './utils.js';

const { _log, __dirname, spinner } = utils;
const loadingSpinner = spinner();
const commandsData = [];

async function importCommandFiles (filePath) {
  _log('Processing: ' + filePath);

  const fileRequired = await import(
    normalize(relative(__dirname, filePath))
  ).then(module => module.default);

  if (fileRequired.hasOwnProperty('name')) {
    commandsData.push(fileRequired);
  } else if ('data' in fileRequired && 'toJSON' in fileRequired.data) {
    commandsData.push(fileRequired.data.toJSON());
  }
}

async function deploy (isTestEnabled) {
  if (commandsData.length) {
    try {
      loadingSpinner.start();
      const res = await fetch(
        `https://discord.com/api/v10/applications/${
          process.env['CLIENT_ID']
        }/guilds/${
          isTestEnabled ? process.env['GUILD_TEST_ID'] : process.env['GUILD_ID']
        }/commands`,
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
      loadingSpinner.stop();
      if (res.code === 200) {
        forEach(res.body, ({ name }) =>
          loadingSpinner.succeed('Deployed: /' + name)
        );
        loadingSpinner.stop();
        process.exit(0);
      } else if ('retry_after' in res.body) {
        loadingSpinner.warn(
          `RATE_LIMIT_EXCEDED (https://discord.com/developers/docs/topics/rate-limits#rate-limits)\nTry again in ${Math.floor(
            res.body.retry_after
          )} seconds.`
        );
      } else {
        _log(`REQUEST_FAILED[${res.code}]`, 'error');
      }
    } catch (e) {
      loadingSpinner.stop();
      _log('FATAL: ' + e, 'error');
    }
  } else {
    _log('commands dir not found.', 'error');
  }
}

async function getCommandFiles (options) {
  const files = glob.stream('**/commands/**/*.{js,cjs,mjs}', {
    ignore: ['**/node_modules/**', '**/.git/**'],
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

function main (options) {
  config({
    path: resolve(options.cwd, '.env'),
    debug: options.debug
  });
  getCommandFiles(options);
}
export default main;
