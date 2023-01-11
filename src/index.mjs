import path from 'node:path';
import nodeevents from 'node:events';
import { fileURLToPath } from 'node:url';
import { config } from 'dotenv';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
import { _log } from './utils.mjs';
import glob from 'glob';
import forEach from 'lodash.foreach';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

nodeevents.setMaxListeners(150);
config();

const api = new REST({ version: '10' }).setToken(process.env['TOKEN']);
const commandsData = [];

function getCommandFiles () {
  const files = glob.sync('../commands/**/*.js', { cwd: __dirname });
  if (files.length) {
    forEach(files, async file => {
      const fileRequired = await import(file);
      const hasDataProperty = Object.keys(fileRequired).some(
        prop => prop === 'data'
      );
      console.debug(hasDataProperty);
      if (hasDataProperty) {
        _log(file);
        commandsData.push(fileRequired.default.data.toJSON());
      }
    });
  } else {
    throw new Error('File doesnt exists.');
  }
}

async function deploy () {
  getCommandFiles();
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
    forEach(resolved, result => _log('Added: ' + result.name));
  } catch (e) {
    throw new Error(e);
  }
}
export default deploy;
