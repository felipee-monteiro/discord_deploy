import path from 'node:path';
import nodeevents from 'node:events';
import { fileURLToPath } from 'node:url';
import { validateCommandObject, _log } from './utils.mjs';
import glob from 'glob';
import forEach from 'lodash.foreach';
import { config } from 'dotenv';
import { REST, Routes } from 'discord.js';

var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);

nodeevents.setMaxListeners(150);
config();

var api = new REST({ version: '10' }).setToken(process.env['TOKEN']);

async function getCommandFiles () {
  var commandsData = [];
  var files = glob.sync('../commands/**/*.js', { cwd: __dirname });
  for (let file of files) {
    commandsData.push(validateCommandObject(await import(file)));
  }
  return commandsData.filter(cmd => typeof cmd !== 'undefined');
}

async function deploy () {
  const commandsData = await getCommandFiles();
  try {
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
      : _log('Error while tryng deploy files.');
    process.exit(0);
  } catch (e) {
    throw new Error(e);
  }
}
export default deploy;
