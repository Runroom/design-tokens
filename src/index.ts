import parseTokens from '@/functions/figmaApiConnector.ts';
import styleDictionary from '@/functions/styleDictionary.ts';
import parserRuntime from 'yargs-parser';
import { ParseConfig } from '@/types/Config.ts';
import * as console from 'console';
import { EMOJIS } from '@/functions/output.ts';

const designTokens = (args: parserRuntime.Arguments, config: ParseConfig) => {
  const command = args._[0];
  const { settings, configFile } = config;

  switch (command) {
    case 'platforms':
      parseTokens(settings).then(() => {
        styleDictionary(configFile);
      });
      break;
    default:
      parseTokens(settings).then(() => {
        console.log(`Design tokens generated ${EMOJIS.success}!`);
      });
      break;
  }
};

export default designTokens;
