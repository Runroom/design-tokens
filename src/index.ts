import styleDictionary from '@/styleDictionary/styleDictionary.ts';
import { Arguments } from 'yargs-parser';
import { ParseConfig } from '@/types/designTokens';
import { figmaApiConnection } from '@/api';
import { createCssTokenFiles, createJsonTokenFiles, EMOJIS, log } from '@/functions';

const designTokens = (args: Arguments, config: ParseConfig) => {
  const command = args._[0];
  const { settings, configFile } = config;

  figmaApiConnection(settings).then(async generatedTokens => {
    log('Generating design tokens...', EMOJIS.workingInProgress);

    await createJsonTokenFiles(generatedTokens, settings);
    await createCssTokenFiles(generatedTokens, settings);

    if (command === 'platforms') {
      styleDictionary(configFile);
    }
  });
};

export default designTokens;
