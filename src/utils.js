"use strict";
exports.__esModule = true;
var node_path_1 = require("node:path");
var node_process_1 = require("node:process");
var ora_1 = require("ora");
var node_url_1 = require("node:url");
var ansi_styles_1 = require("ansi-styles");
function spinner(text) {
    if (text === void 0) { text = 'Deploying your files...'; }
    return (0, ora_1["default"])({
        text: text,
        indent: 1
    });
}
var LOG_LEVELS = [
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
var debugMode = process.argv.some(function (arg) { return arg === '--debug'; });
var __filename = function (filename) {
    return (0, node_url_1.fileURLToPath)(filename);
};
exports["default"] = {
    _log: function (message, level) {
        if (level === void 0) { level = 'info'; }
        var _logProps = LOG_LEVELS.find(function (log) { return log.level === level; });
        if (debugMode && _logProps) {
            console[level](ansi_styles_1["default"][_logProps.color].open, _logProps.prefix, message, ansi_styles_1["default"][_logProps.color].close);
        }
        else if (level === 'error') {
            spinner().fail('An error was ocurred. use --debug to see the details.');
            (0, node_process_1.exit)(1);
        }
    },
    __filename: __filename,
    __dirname: function (filename) { return (0, node_path_1.dirname)(__filename(filename)); },
    spinner: spinner
};
