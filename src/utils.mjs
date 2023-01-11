import { SlashCommandBuilder } from 'discord.js';
import colors from 'ansi-styles';

var debugMode = process.argv.some(arg => arg === '--debug');

export const _log = function (message) {
  if (debugMode) {
    console.info(
      `${colors.cyanBright.open}[DEBUG] ${message}${colors.cyanBright.close}`
    );
  }
};
export const validateCommandObject = function (obj) {
  for (let key in obj) {
    if (
      Object.hasOwnProperty.call(obj, key) &&
      Object.hasOwnProperty.call(obj[key], 'data') &&
      obj[key].data instanceof SlashCommandBuilder
    ) {
      var file = obj[key]['data'];
      _log(file['name']);
      return file.toJSON();
    }
  }
};
