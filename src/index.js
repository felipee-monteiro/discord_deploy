import nodeevents from 'node:events';
import { config } from 'dotenv';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
import glob from 'glob';
import { _log } from './utils.js';
import forEach from 'lodash.foreach';

nodeevents.setMaxListeners(150);

config();

const api = new REST({ version: '10' }).setToken(process.env['TOKEN']);
const commandsData = [];

function getCommandFiles () {
  const files = glob.sync('../commands/**/*.js', { cwd: __dirname });
  if (files.length) {
    forEach(files, file => {
      _log(file);
      if (fileRequired.hasOwnProperty('data')) {
        commandsData.push(fileRequired.data.toJSON());
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
