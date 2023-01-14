import glob from 'fast-glob';
import path from 'node:path';
import normalize from 'normalize-path';
import { config } from 'dotenv';
import { REST, Routes, SlashCommandBuilder } from 'discord.js';
import utils from './utils.js';

const { _log, __dirname } = utils;
var commandsData = new Map();
commandsData.set('commandsAsJson', []);
var commandsDataAsJSON = commandsData.get('commandsAsJson');

function validateCommandObject (file) {
  Object.keys(file).forEach(fileProp => {
    if (fileProp === 'data') {
      commandsDataAsJSON.push(file[fileProp].toJSON());
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
        normalize(path.relative(__dirname, file))
      );
      validateCommandObject(fileRequired);
    }
  } else {
    _log('"commands" dir not found. path: ' + cwd, 'error');
    process.exit(1);
  }
}

async function deploy ({ cwd, debug, test }) {
  config({
    path: path.resolve(cwd, '.env'),
    debug
  });
  try {
    void (await getCommandFiles(cwd));
    var api = new REST({ version: '10' }).setToken(process.env['TOKEN']);
    const resolved = await api.put(
      Routes.applicationGuildCommands(
        process.env['CLIENT_ID'],
        test ? process.env['GUILD_TEST_ID'] : process.env['GUILD_ID']
      ),
      {
        body: commandsDataAsJSON
      }
    );
    resolved.length
      ? _log('Deployed Success!')
      : _log('Failed to push some refs.', 'error');
    process.exit(0);
  } catch (e) {
    _log(e, 'error');
    process.exit(1);
  }
}
export default deploy;
