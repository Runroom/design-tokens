#!/usr/bin/env node

require = require("esm")(module /*, options */);

const fs = require('file-system');
const figmaConnector = require('./src/figma-connector');
const parserRuntime = require('yargs-parser')(process.argv.slice(2));
const defaultConfigFilePath = './default.config.json';

const configFilePath = parserRuntime['config'] ? parserRuntime['config'] : defaultConfigFilePath;

fs.access(configFilePath, fs.F_OK, (err) => {
    fs.readFile(configFilePath, "utf8", (err, data) => {
        if (err) throw err;
        const { FIGMA_APIKEY, FIGMA_ID, FIGMA_OUTDIR } = JSON.parse(data);
        if (!FIGMA_APIKEY) {
            return console.log("❌ No Figma API Key found");
        } else if (!FIGMA_ID) {
            return console.log("❌ No Figma ID found");
        } else {
            if (!FIGMA_OUTDIR) {
                console.log("⚠️ No outdir found, default outdir is `tokens`");
            }
            fs.mkdir(`${FIGMA_OUTDIR}`, null, (err) => {
                if (err) throw err;
                figmaConnector.getTokens(FIGMA_APIKEY, FIGMA_ID, FIGMA_OUTDIR);
            });
        }
    });
});