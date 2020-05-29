require = require("esm")(module /*, options */);
const path = require('path');

const figmaCli = require('./src/figma-cli.js');
const styleDictionary = require('./src/style-dictionary.js');
const CONFIG_FILE_DEFAULT = 'designtokens.config.json';

const appDir = path.resolve(__dirname).split('/node_modules')[0];

function designTokens(argv) {
  const command = argv._[0];
  const configFile = `${appDir}/${argv['config-file'] || CONFIG_FILE_DEFAULT}`;

  switch (command) {
    case 'figma':
      figmaCli(configFile);
      break;
    case 'build':
      styleDictionary(configFile);
      break;
    default:
      figmaCli(configFile).then(() => {
        styleDictionary(configFile);
      });
      break;
  }
}

module.exports = designTokens;
