#!/usr/bin/env node

require = require("esm")(module /*, options */);

const fs = require('file-system');
const figmaConnector = require('./src/figma-connector');
const parserRuntime = require('yargs-parser')(process.argv.slice(2));
const defaultConfigFilePath = './designtokens.config.json';
const emojis = require('./src/utils').emojis;

const configFilePath = parserRuntime['config'] ? parserRuntime['config'] : defaultConfigFilePath;

fs.access(configFilePath, fs.F_OK, err => {
  fs.readFile(configFilePath, "utf8", (err, data) => {
    if (err) throw new Error(`\x1b[31m${emojis.error} Config file not found. Trying to use: '${configFilePath}'\n\n`);
    const { FIGMA_APIKEY, FIGMA_ID, FIGMA_OUTDIR, FIGMA_PAGE_NAME } = JSON.parse(data);
    if (!FIGMA_APIKEY) {
      return console.error(`${emojis.error} No Figma API Key found`);
    } else if (!FIGMA_ID) {
      return console.error(`${emojis.error} No Figma ID found`);
    } else if (!FIGMA_PAGE_NAME) {
      return console.error(`${emojis.error} No Figma Page Name found`);
    } else {
      if (!FIGMA_OUTDIR || FIGMA_OUTDIR === '') {
        console.warn(`${emojis.warning} No outdir found, default outdir is 'tokens'\n`);
        outDir = 'tokens';
      } else {
        outDir = FIGMA_OUTDIR;
      }
      fs.mkdir(outDir, null, (err) => {
        if (err) throw err;
        figmaConnector.getTokens(FIGMA_APIKEY, FIGMA_ID, outDir, FIGMA_PAGE_NAME);
      });
    }
  });
});
