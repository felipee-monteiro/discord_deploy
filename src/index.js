import glob from 'fast-glob';
import { resolve, relative } from 'node:path';
import normalize from 'normalize-path';
import { config } from 'dotenv';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
import loading from 'ora';
import utils from './utils.js';

const { _log, __dirname } = utils;
const { applicationGuildCommands } = Routes;
var spinner = loading('Deploying your commands...');
var commandsData = new Map();
commandsData.set('commandsAsJson', []);
var commandsDataAsJSON = commandsData.get('commandsAsJson');

function validateCommandObject (file) {
  Object.keys(file).forEach(fileProp => {
    if (fileProp === 'data') {
      commandsDataAsJSON.push(file[fileProp]?.toJSON());
    }
  });
}

async function getCommandFiles (cwd) {
  var files = glob.sync('**/commands/**/*.{js,cjs,mjs}', {
    cwd,
    absolute: true,
    ignore: ['**/node_modules/**', '**/.git/**']
  });
  if (files.length) {
    for (let file of files) {
      _log('Processing: ' + file);
      const { default: fileRequired } = await import(
        normalize(relative(__dirname, file))
      );
      validateCommandObject(fileRequired);
    }
  } else {
    _log(
      '"commands" dir not found. You can change the cwd overriding --cwd option.\n cwd: ' +
        cwd,
      'error'
    );
  }
}

async function deploy ({ cwd, debug, test }) {
  config({
    path: resolve(cwd, '.env'),
    debug
  });
  try {
    await getCommandFiles(cwd);
    var api = new REST({ version: '10' }).setToken(process.env['TOKEN']);
    spinner.start();
    var isCommandsDeployed = await api.put(
      applicationGuildCommands(
        process.env['CLIENT_ID'],
        test ? process.env['GUILD_TEST_ID'] : process.env['GUILD_ID']
      ),
      {
        body: commandsDataAsJSON
      }
    );
    spinner.stop();
    if (isCommandsDeployed.length) {
      isCommandsDeployed.forEach(({ name }) =>
        spinner.succeed('Deployed: ' + name)
      );
      process.exit(0);
    } else {
      _log('Failed to push some refs. Aborting...', 'error');
    }
  } catch (e) {
    spinner.stop();
  }
}
export default deploy;
