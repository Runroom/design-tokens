import parseTokens from '@/functions/figma-parser.ts';
import styleDictionary from '@/functions/style-dictionary.ts';

const designTokens = (args: any, config: any) => {
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
