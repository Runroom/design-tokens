import { buildStyleDictionary } from '@/styleDictionary/styleDictionary.ts';
import { Config } from '@/types/designTokens';
import { figmaApiConnection } from '@/api';
import { createJsonTokenFiles, EMOJIS, log } from '@/functions';

const designTokens = (config: Config) => {
  figmaApiConnection(config).then(async generatedTokens => {
    log('Generating design tokens...', EMOJIS.workingInProgress);

    await createJsonTokenFiles(generatedTokens, config);

    buildStyleDictionary(config);
  });
};

export default designTokens;
