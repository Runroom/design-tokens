import fs from 'fs';
import path from 'path';
import { Arguments } from 'yargs-parser';
import { Config, FigmaPages, ParseConfig } from '@/types/designTokens';
import { EMOJIS, logWarning } from './logger.ts';

const CONFIG_FILE_DEFAULT1 = 'designtokens.config.json';
const CONFIG_FILE_DEFAULT2 = 'design-tokens.config.json';

const getConfigFilePath = (APP_DIR: string, argv: Arguments) =>
  `${APP_DIR}/${argv['config-file'] || CONFIG_FILE_DEFAULT1 || CONFIG_FILE_DEFAULT2}`.replace(
    /(\/\/)+/g,
    '/'
  );

const throwError = (error?: string) => {
  if (!error) {
    throw new Error(`\n\x1b[31m${EMOJIS.error} Unknown error.\n`);
  }

  throw new Error(`\n\x1b[31m${EMOJIS.error} ${error}.\n`);
};

const handleErrors = (figmaApiKey: string, figmaProjectId: string, figmaPages: FigmaPages) => {
  if (!figmaApiKey) {
    throwError('No Figma API Key found');
  } else if (!figmaProjectId) {
    throwError('No Figma ID found');
  } else if (!figmaPages || (figmaPages && Object.keys(figmaPages).length === 0)) {
    throwError('No Figma Pages found');
  }
};

const getTokensDir = (outputDir: string) => {
  if (!outputDir || outputDir === '') {
    logWarning(`No TOKENS_DIR found, default outdir is set to 'tokens'`);
    return 'tokens';
  }

  return outputDir;
};

const createDir = (tokensDir: string) => {
  if (!fs.existsSync(tokensDir)) {
    fs.mkdirSync(tokensDir, null);
  }
};

const configFileParser = (argv: Arguments) => {
  const APP_DIR = path.resolve().split('/node_modules')[0];
  const configFile = getConfigFilePath(APP_DIR, argv);

  return new Promise<ParseConfig>(resolve => {
    fs.access(configFile, fs.constants.F_OK, error => {
      if (error) {
        throwError(
          "Config file is not accessible. please check the users's permissions on the file"
        );
      }

      fs.readFile(configFile, 'utf8', (error, data) => {
        if (error) {
          throwError(
            "Config file not found.\nUse default 'designtokens.config.json' or specify a different one by using --config-file=FILENAME"
          );
        }

        const settings: Config = JSON.parse(data);
        const { figmaApiKey, figmaProjectId, outputDir, figmaPages } = settings;
        const tokensDir = getTokensDir(outputDir);

        handleErrors(figmaApiKey, figmaProjectId, figmaPages);
        createDir(tokensDir);

        resolve({ settings, configFile });
      });
    });
  });
};

export { configFileParser };
