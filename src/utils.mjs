const debugMode = process.argv.some(arg => arg === '--debug');
export const _log = function (message) {
  if (debugMode) {
    console.info(`[DEBUG] ${message}`);
  }
};
