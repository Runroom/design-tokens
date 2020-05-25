require = require("esm")(module /*, options */);
const figmaCli = require('./src/figma-cli.js');
const styleDictionary = require('./src/style-dictionary.js');
const CONFIG_FILE_DEFAULT = 'designtokens.config.json';

function designTokens(argv) {
  const command = argv._[0];
  const configFile = `${__dirname}/${argv['config-file'] || CONFIG_FILE_DEFAULT}`;

  switch (command) {
    case 'figma':
      figmaCli(configFile);
      break;
    case 'build':
      styleDictionary(configFile)
      break;
    default:
      console.log('DEFAULT');
      break;
  }

  // console.log(argv)
  // if()

  // if(parserRuntime['sync']) console.log('Sync');
  // if(parserRuntime['config-file']) console.log('Config file');
}

module.exports = designTokens;
