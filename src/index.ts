import figmaApiConnection from '@/api/figmaApiConnector.ts';
import styleDictionary from '@/functions/styleDictionary.ts';
import { Arguments } from 'yargs-parser';
import { EMOJIS, log } from '@/functions/logger.ts';
import { createCSSTokenFiles, createJsonTokenFiles } from '@/functions/fileIO.ts';
import { ParseConfig } from '@/types/designTokens';

const designTokens = (args: Arguments, config: ParseConfig) => {
  const command = args._[0];
  const { settings, configFile } = config;

  figmaApiConnection(settings).then(generatedTokens => {
    log('Generating design tokens...', EMOJIS.workingInProgress);

    createJsonTokenFiles(generatedTokens, settings);
    createCSSTokenFiles(generatedTokens, settings);
  });

  if (command === 'platforms') {
    styleDictionary(configFile);
  }
};

export default designTokens;
