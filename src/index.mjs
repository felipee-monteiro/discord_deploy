import glob from 'fast-glob';
import path from 'node:path';
import { config } from 'dotenv';
import { REST, Routes, SlashCommandBuilder } from 'discord.js';
import { unixify, _log, __dirname } from './utils.mjs';
import nodeevents from 'node:events';

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
      commandsData.push(file.toJSON());
      _log('Success Deployed: ' + file['name']);
    }
  }
}

async function getCommandFiles (cwd) {
  var files = await glob('**/commands/**', {
    cwd,
    globstar: true,
    absolute: true,
    ignore: ['node_modules', '**/node_modules/**', unixify(__dirname)]
  });
  if (files.length) {
    for (let file of files) {
      validateCommandObject(
        await import(unixify(path.relative(__dirname, file)))
      );
    }
  } else {
    _log('Dir not found. path: ' + jsFilesPath, 'error');
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
