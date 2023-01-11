const debugMode = process.argv.find(arg => arg === '--debug');

module.exports._log = function (message) {
  if (debugMode) {
    console.debug(`[DEBUG]~${message}`);
  }
};
