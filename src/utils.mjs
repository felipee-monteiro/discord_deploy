import { SlashCommandBuilder } from 'discord.js';
import colors from 'ansi-styles';

var _logLevels = [
  {
    level: 'info',
    color: 'cyanBright',
    prefix: '[INFO]'
  },
  {
    level: 'warn',
    color: 'yellow',
    prefix: '[WARNING]'
  },
  {
    level: 'error',
    color: 'redBright',
    prefix: '[ERROR]'
  }
];

var debugMode = process.argv.some(arg => arg === '--debug');
export const _log = function (message, level = 'info') {
  var _logProps = _logLevels.find(log => log.level === level);
  if (debugMode && _logProps) {
    console[_logProps.level](
      colors[_logProps.color]['open'],
      _logProps.prefix,
      message,
      colors[_logProps.color]['close']
    );
  }
};
export const validateCommandObject = function (obj) {
  for (const key in obj) {
    if (
      Object.hasOwnProperty.call(obj[key], 'data') &&
      obj[key].data instanceof SlashCommandBuilder
    ) {
      var file = obj[key].data;
      _log(file['name']);
      return file.toJSON();
    }
  }
};
