import { buildStyleDictionary } from '@/styleDictionary/styleDictionary.ts';
import { ParseConfig } from '@/types/designTokens';
import { figmaApiConnection } from '@/api';
import { createJsonTokenFiles, EMOJIS, log } from '@/functions';

const designTokens = (config: ParseConfig) => {
  const { settings } = config;

  figmaApiConnection(settings).then(async generatedTokens => {
    log('Generating design tokens...', EMOJIS.workingInProgress);

    await createJsonTokenFiles(generatedTokens, settings);

    buildStyleDictionary(settings);
  });
};

export default designTokens;
