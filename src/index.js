import glob from 'fast-glob';
import forEach from 'lodash.foreach';
import { resolve, relative } from 'node:path';
import normalize from 'normalize-path';
import { config } from 'dotenv';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
import utils from './utils.js';

const { _log, __dirname, spinner } = utils;
const { applicationGuildCommands } = Routes;
const commandsDataAsJSON = [];

async function importCommandFiles (filePath) {
  var filePathAsString = filePath.toString();
  _log('Processing: ' + filePathAsString);
  const { default: fileRequired } = await import(
    normalize(relative(__dirname, filePathAsString))
  );
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
  files.on('error', error => console.debug(error));
  files.on('end', () => deploy(options.test));
}

async function deploy (isTestEnabled) {
  try {
    var api = new REST({ version: '10' }).setToken(process.env['TOKEN']);
    spinner.start();
    var isCommandsDeployed = await api.put(
      applicationGuildCommands(
        process.env['CLIENT_ID'],
        isTestEnabled ? process.env['GUILD_TEST_ID'] : process.env['GUILD_ID']
      ),
      {
        body: commandsDataAsJSON
      }
    );
    spinner.stop();
    if (isCommandsDeployed.length) {
      forEach(isCommandsDeployed, ({ name }) =>
        spinner.succeed('Deployed: ' + name)
      );
      process.exit(0);
    } else {
      _log('Failed to push some refs. Aborting...', 'error');
    }
  } catch (e) {
    spinner.stop();
    _log('FATAL: ' + e, 'error');
  }
}

async function main (options) {
  config({
    path: resolve(options.cwd, '.env'),
    debug: options.debug
  });
  getCommandFiles(options);
}
export default main;
