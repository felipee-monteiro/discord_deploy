const debugMode = process.argv.find(arg => arg === '--debug');
export const _log = function (message) {
    if (debugMode) {
        console.info(`%c[DEBUG] ${message}`, 'color: #bada55;');
    }
};
