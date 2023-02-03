import { dirname } from 'node:path';
import { exit } from 'node:process';
import loading from 'ora';
import { fileURLToPath } from 'node:url';
import colors, { ForegroundColorName } from 'ansi-styles';

interface LogLevels {
  level: string;
  color: ForegroundColorName;
  prefix: string;
}

function spinner (text: string = 'Deploying your files...') {
  return loading({
    text,
    indent: 1
  });
}
const LOG_LEVELS: LogLevels[] = [
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

export default {
  _log: function (
    message: string,
    level: 'info' | 'log' | 'warn' | 'error' = 'info'
  ) {
    const _logProps = LOG_LEVELS.find(log => log.level === level);
    if (debugMode && _logProps) {
      console[level](
        colors[_logProps.color].open,
        _logProps.prefix,
        message,
        colors[_logProps.color].close
      );
    } else if (level === 'error') {
      spinner().fail('An error was ocurred. use --debug to see the details.');
      exit(1);
    }
  },
  __dirname: filename => dirname(fileURLToPath(filename)),
  spinner
};
