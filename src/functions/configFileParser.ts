import fs from 'fs';
import path from 'path';
import { Arguments } from 'yargs-parser';
import { Config, ParseConfig } from '@/types/designTokens';
import { EMOJIS, logWarning } from './logger.ts';

const CONFIG_FILE_DEFAULT1 = 'designtokens.config.json';
const CONFIG_FILE_DEFAULT2 = 'design-tokens.config.json';

const getConfigFilePath = (APP_DIR: string, argv: Arguments) =>
  `${APP_DIR}/${argv['config-file'] || CONFIG_FILE_DEFAULT1 || CONFIG_FILE_DEFAULT2}`;

const throwError = (error?: string) => {
  if (!error) {
    throw new Error(`\n\x1b[31m${EMOJIS.error} Unknown error.\n`);
  }

  throw new Error(`\n\x1b[31m${EMOJIS.error} ${error}.\n`);
};

const handleErrors = (FIGMA_APIKEY: string, FIGMA_ID: string, FIGMA_PAGE_NAME: string) => {
  if (!FIGMA_APIKEY) {
    throwError('No Figma API Key found');
  } else if (!FIGMA_ID) {
    throwError('No Figma ID found');
  } else if (!FIGMA_PAGE_NAME) {
    throwError('No Figma Page Name found');
  }
};

const getTokensDir = (TOKENS_DIR: string) => {
  if (!TOKENS_DIR || TOKENS_DIR === '') {
    logWarning(`No TOKENS_DIR found, default outdir is set to 'tokens'`);
    return 'tokens';
  }

  return TOKENS_DIR;
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
        const { FIGMA_APIKEY, FIGMA_ID, FIGMA_PAGE_NAME } = settings;
        const { TOKENS_DIR } = settings;
        const tokensDir = getTokensDir(TOKENS_DIR);

        handleErrors(FIGMA_APIKEY, FIGMA_ID, FIGMA_PAGE_NAME);
        createDir(tokensDir);

        resolve({ settings, configFile });
      });
    });
  });
};

export { configFileParser };
