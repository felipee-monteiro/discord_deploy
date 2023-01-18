### First of all, thank you guys for installing !

### Before Start

- "TOKEN" and "GUILD_ID" env variables are required. (GUILD_TEST_ID is opcional);
- "commands" directory must exists anywhere in your project.
- Each command must have 'data' property exported, witch contains the instance of command builder.
  
Example (on Discord.js):

```js
// CommonJS
module.exports = { data: new SlashCommmandBuilder() };
```

```js
 // ESM
 export default {
   data: new SlashCommmandBuilder()
 }
```

### Why

#### Simple:

With one command, you are done to deploy slash commands easily.

#### Tiny:

Just 2.8kB (main file).

#### Supports CommonJS and ESM for commands files.

#### Hight Peformant and Scalable:

Uses streams and dynamic imports to support large files on demand.

### Install

```bash
 npm install discord_deploy@latest
````

### Usage

```bash
  discord_deploy deploy [options]

  Options:
  -d, --debug  run in debug mode. (default: false)
  --cwd <dir>  Absolute directory to search for. (default: C:\Users\Felipe\Desktop\projects\www\nodejs\discord_deploy)
  --test       Enables test mode (Requires GUILD_TEST_ID env key). (default: false)
  -h, --help   display CLI Help.
```
