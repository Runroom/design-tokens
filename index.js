import path from 'path';

import figmaCli from './src/figma-cli.js';
import styleDictionary from './src/style-dictionary.js';

const APP_DIR = path.resolve().split('/node_modules')[0];
const CONFIG_FILE_DEFAULT1 = 'designtokens.config.json';
const CONFIG_FILE_DEFAULT2 = 'design-tokens.config.json';

const designTokens = argv => {
  const command = argv._[0];
  const configFile = `${APP_DIR}/${
    argv['config-file'] || CONFIG_FILE_DEFAULT1 || CONFIG_FILE_DEFAULT2
  }`;

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
};

export default designTokens;
