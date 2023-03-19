### First of all, thank you guys for installing !

> A CLI to deploy slash guild commands easily.

### TypeScript Support is Experimental.

### Before Start

- "BOT_TOKEN", "GUILD_ID" and "CLIENT_ID" env variables are required;
- "commands" directory must exists anywhere in your project.
- GUILD_TEST_ID should exists in test mode, otherwise GUILD_ID will be used.


If you are using Discord.js, each command must export an object with have 'data' property, witch contains the instance of command builder.
  in case of eris.js, you can pass an object containing some properties. see the examples below:

Example (Discord.js):

```js
// commands/example01.js
module.exports = {
  data: new SlashCommmandBuilder(),
  ...
};
```

```js
 // commands/example01.mjs
 export default {
   data: new SlashCommmandBuilder(),
   ...
 };
```

Eris.js:

```js
// commands/example01.js
module.exports = {
  name: 'command-name', // required field,
  description: 'command-description' // required field,
  ...
};
```

```js
 // commands/example01.mjs
 export default {
    name: 'command-name',
    description: 'command-description',
    ...
 };
```

### Why ?

#### Simple:

With one command, you are done to deploy slash commands easily.
Supports TypeScript Command Files with the power of [esbuild](https://github.com/evanw/esbuild)

#### Tiny:

Just 3.49KB.

#### Supports CommonJS and ESM files.

#### Faster:

Uses streams and dynamic imports to support large files on demand.

### Install

```bash
 npm install discord_deploy@latest
```

### Usage

```bash
  discord_deploy deploy [options]

  Options:
    -d, --debug  run in debug mode. (default: false)
    --cwd <dir>  Absolute directory to search for. (default: process.cwd())
    --test       Enables test mode (Requires GUILD_TEST_ID env key). (default: false)
    -h, --help   display CLI Help.
```
