// const figmaCli = require('src/figma-cli.js');
// const styleDictionary = require('src/style-dictionary.js');
const CONFIG_FILE_DEFAULT = 'designtokens.config.json';

function designTokens(argv) {
  const command = argv._[0];
  const configFile = argv['config-file'] || CONFIG_FILE_DEFAULT_PATH;

  console.log(configFile);

  switch (command) {
    case 'sync':
      console.log('Sync');
      break;
    case 'build':

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
