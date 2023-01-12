import nodeevents from 'node:events';
import { relative, join, normalize, isAbsolute } from 'node:path';
import { _log, __dirname } from './utils.mjs';
import glob from 'fast-glob';
import { config } from 'dotenv';
import { REST, Routes, SlashCommandBuilder } from 'discord.js';

nodeevents.setMaxListeners(150);
config();

var api = new REST({ version: '10' }).setToken(process.env['TOKEN']);
var commandsData = [];

function validateCommandObject (obj) {
  for (const key in obj) {
    if (
      Object.hasOwnProperty.call(obj[key], 'data') &&
      obj[key].data instanceof SlashCommandBuilder
    ) {
      var file = obj[key].data;
      _log(file['name']);
      commandsData.push(file.toJSON());
    }
  }
}

async function getCommandFiles (cwd) {
  var commandsPath = relative(__dirname, join(cwd, 'commands')).split('\\')[0];
  var jsFilesPath = `${commandsPath}/commands/**/*.{js,mjs}`;
  var files = await glob(jsFilesPath, {
    cwd: __dirname,
    absolute: isAbsolute(jsFilesPath)
  });
  if (files.length) {
    for (let file of files) {
      validateCommandObject(await import(file));
    }
  } else {
    _log('Files not found. path: ' + cwd, 'error');
    process.exit(1);
  }
}

async function deploy (options) {
  try {
    await getCommandFiles(options.cwd);
    const resolved = await api.put(
      Routes.applicationGuildCommands(
        process.env['CLIENT_ID'],
        process.env['GUILD_TEST_ID']
      ),
      {
        body: commandsData
      }
    );
    _log('Deployed Success!');
    process.exit(0);
  } catch (e) {
    _log(e, 'error');
    process.exit(1);
  }
}
export default deploy;
