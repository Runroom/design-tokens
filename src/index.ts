import { buildStyleDictionary } from '@/styleDictionary/StyleDictionary.ts';
import { Arguments } from 'yargs-parser';
import { ParseConfig } from '@/types/designTokens';
import { figmaApiConnection } from '@/api';
import { createJsonTokenFiles, EMOJIS, log } from '@/functions';

const designTokens = (args: Arguments, config: ParseConfig) => {
  const { settings, configFile } = config;

  figmaApiConnection(settings).then(async generatedTokens => {
    log('Generating design tokens...', EMOJIS.workingInProgress);

    await createJsonTokenFiles(generatedTokens, settings);
    buildStyleDictionary(configFile);
  });
};

export default designTokens;
