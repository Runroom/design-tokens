const parserRuntime = require('yargs-parser')(process.argv.slice(2));
const defaultConfigFilePath = './designtokens.config.json';

const configFilePath = parserRuntime['config'] ? parserRuntime['config'] : defaultConfigFilePath;
const StyleDictionary = require('style-dictionary').extend(configFilePath);

console.log(` Compiling styles...`);
StyleDictionary.buildAllPlatforms();
