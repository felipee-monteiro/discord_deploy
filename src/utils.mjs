import path from 'node:path';
import { fileURLToPath } from 'node:url';
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

export function unixify (windowsPath) {
  return windowsPath.includes(path.win32.sep)
    ? windowsPath.replace(/\\/g, '/')
    : new TypeError('Path must be a Windows Path');
}

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);
