import glob from 'fast-glob';
import forEach from 'lodash.foreach';
import { resolve, relative } from 'node:path';
import normalize from 'normalize-path';
import { config } from 'dotenv';
import fetch from 'node-fetch';
import utils from './utils.js';

const { _log, __dirname, __filename, spinner } = utils;
const loadingSpinner = spinner();
const commandsDataAsJSON = [];

async function importCommandFiles (filePath) {
  var filePathAsString = filePath.toString();
  _log('Processing: ' + filePathAsString);
  var fileRequired = await import(
    normalize(relative(__dirname, filePathAsString))
  ).then(module => module.default);
  if ('data' in fileRequired) {
    commandsDataAsJSON.push(fileRequired.data.toJSON());
  }
}

async function getCommandFiles (options) {
  var files = glob.stream('**/commands/**/*.{js,cjs,mjs}', {
    ignore: ['**/node_modules/**', '**/.git/**'],
    cwd: options.cwd,
    absolute: true
  });
  files.on('data', importCommandFiles);
  files.on('error', error => _log(error, 'error'));
  files.on('end', () => deploy(options.test));
}

async function deploy (isTestEnabled) {
  if (commandsDataAsJSON.length) {
    try {
      loadingSpinner.start();
      var res = await fetch(
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
          body: JSON.stringify(commandsDataAsJSON)
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
        const { retry_after } = res.body;
        loadingSpinner.warn(
          `RATE_LIMIT_EXCEDED (https://discord.com/developers/docs/topics/rate-limits#rate-limits)\nTry again in ${Math.floor(retry_after)} seconds.`
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

function main (options) {
  config({
    path: resolve(options.cwd, '.env'),
    debug: options.debug
  });
  getCommandFiles(options);
}
export default main;
