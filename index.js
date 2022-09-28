import parseTokens from './src/figma-parser.js';
import styleDictionary from './src/style-dictionary.js';

const designTokens = (args, config) => {
  const command = args._[0];
  const { settings, configFile } = config;

  switch (command) {
    case 'platforms':
      parseTokens(settings).then(() => {
        styleDictionary(configFile);
      });
      break;
    default:
      parseTokens(settings);
      break;
  }
};

export default designTokens;
