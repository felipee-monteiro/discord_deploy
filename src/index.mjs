import { dirname } from 'node:path';
import nodeevents from 'node:events';
import { fileURLToPath } from 'node:url';
import { _log } from './utils.mjs';
import glob from 'glob';
import { config } from 'dotenv';
import { REST, Routes, SlashCommandBuilder } from 'discord.js';

var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);

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

async function getCommandFiles () {
  var files = glob.sync('../commands/**/*.js', { cwd: __dirname });
  for (let file of files) {
    validateCommandObject(await import(file));
  }
}

async function deploy () {
  try {
    await getCommandFiles();
    const resolved = await api.put(
      Routes.applicationGuildCommands(
        process.env['CLIENT_ID'],
        process.env['GUILD_TEST_ID']
      ),
      {
        body: commandsData
      }
    );
    resolved.length
      ? _log('Deployed Success!')
      : _log('Error while tryng deploy files.', 'error');
    process.exit(0);
  } catch (e) {
    _log(e, 'error');
  }
}
export default deploy;
