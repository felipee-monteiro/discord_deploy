require('node:events').setMaxListeners(100);
const { sync } = require('glob');
require('dotenv').config({
  debug: true
});

const { REST, Routes, SlashCommandBuilder } = require('discord.js');
const api = new REST({ version: '10' }).setToken(process.env['TOKEN']);
const commandsData = [];

const files = sync('../commands/**/*.js', { cwd: __dirname });
if (files.length) {
  files.forEach(file => {
    const fileRequired = require(file);
    if (
      fileRequired.hasOwnProperty('data') &&
      fileRequired.data instanceof SlashCommandBuilder
    ) {
      commandsData.push(fileRequired.data.toJSON());
    }
  });
} else {
  throw new Error('File doesnt exists.');
}

async function deploy () {
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
    console.debug('Sucess: ' + resolved);
  } catch (e) {
    throw new Error(e);
  }
}

module.exports = deploy;
