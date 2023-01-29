import { dirname } from 'node:path';
import loading from 'ora';
import { fileURLToPath } from 'node:url';
import colors from 'ansi-styles';

function spinner (text = 'Deploying your files...') {
  return loading({
    text,
    indent: 1
  });
}
const LOG_LEVELS = [
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
const debugMode = process.argv.some(arg => arg === '--debug');

const __filename = fileURLToPath(import.meta.url);
export default {
  _log: function (message, level = 'info') {
    const _logProps = LOG_LEVELS.find(log => log.level === level);
    if (debugMode && _logProps) {
      console[_logProps.level](
        colors[_logProps.color]['open'],
        _logProps.prefix,
        message,
        colors[_logProps.color]['close']
      );
    } else if (level === 'error') {
      spinner().fail('An error was ocurred. use --debug to see the details.');
      process.exit(1);
    }
  },
  __dirname: dirname(__filename),
  spinner
};
