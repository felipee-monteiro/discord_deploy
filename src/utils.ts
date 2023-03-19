import loading from 'ora';
import colors, { ForegroundColorName } from 'ansi-styles';

interface LogLevels {
  level: string;
  color: ForegroundColorName;
  prefix: string;
}

function spinner(text: string = 'Deploying your files...') {
  return loading({
    text,
    indent: 1,
  });
}
const LOG_LEVELS: LogLevels[] = [
  {
    level: 'info',
    color: 'cyanBright',
    prefix: '[INFO]',
  },
  {
    level: 'log',
    color: 'greenBright',
    prefix: '[SUCCESS]',
  },
  {
    level: 'warn',
    color: 'yellow',
    prefix: '[WARNING]',
  },
  {
    level: 'error',
    color: 'redBright',
    prefix: '[ERROR]',
  },
];

const debugMode = process.argv.slice(2).filter(arg => arg === '--debug');

export default {
  _log: function (
    message: string,
    level: 'info' | 'log' | 'warn' | 'error' = 'info'
  ) {
    const _logProps = LOG_LEVELS.find((log) => log.level === level);
    if (_logProps && debugMode) {
      console[level](
        colors[_logProps.color].open,
        _logProps.prefix,
        message,
        colors[_logProps.color].close
      );
    } else if (_logProps?.level === 'error') {
      console[level](
        colors[_logProps.color].open,
        _logProps.prefix,
        message,
        colors[_logProps.color].close
      );
    }
  },
  spinner,
};
