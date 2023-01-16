import path from 'node:path';
import { fileURLToPath } from 'node:url';
import loading from 'ora';
import colors from 'ansi-styles';

var spinner = loading({
  text: 'Deploying your files...',
  indent: 1
});
var _logLevels = [
  {
    level: 'info',
    color: 'cyanBright',
    prefix: '[INFO]'
  },
  {
    level: 'log',
    color: 'greenBright',
    prefix: '[SUCCESS]'
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

const __filename = fileURLToPath(import.meta.url);
export default {
  _log: function (message, level = 'info') {
    var _logProps = _logLevels.find(log => log.level === level);
    if (debugMode && _logProps) {
      console[_logProps.level](
        colors[_logProps.color]['open'],
        _logProps.prefix,
        message,
        colors[_logProps.color]['close']
      );
    } else if (level === 'error') {
      spinner.fail('An error was ocurred. use --debug the see the details.');
      process.exit(1);
    }
  },
  __dirname: path.dirname(__filename)
};
