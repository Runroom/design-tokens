import path from 'path';
import { Arguments } from 'yargs-parser';
import { Config, FigmaPages } from '@/types/designTokens';
import { EMOJIS, log, logWarning } from './logger.ts';
import fs from 'fs';
import { cosmiconfig } from 'cosmiconfig';
import { CosmiconfigResult } from 'cosmiconfig/dist/types';

const CONFIG_FILE_DEFAULT = 'designtokens';

const getConfigFilePath = (APP_DIR: string, argv: Arguments) =>
  argv['config-file'] ? `${APP_DIR}/${argv['config-file']}` : '';

const customError = (error?: string): Error => {
  if (!error) {
    return new Error(`Unknown error.\n`);
  }

  return new Error(`${error}.\n`);
};

const handleErrors = (figmaApiKey: string, figmaProjectId: string, figmaPages: FigmaPages) => {
  if (!figmaApiKey) {
    throw customError('No Figma API Key found');
  } else if (!figmaProjectId) {
    throw customError('No Figma ID found');
  } else if (!figmaPages || (figmaPages && Object.keys(figmaPages).length === 0)) {
    throw customError('No Figma Pages found');
  }
};

const getTokensDir = (outputDir: string) => {
  if (!outputDir || outputDir === '') {
    logWarning(`No TOKENS_DIR found, default 'outputDir' is set to 'tokens'`);
    return 'tokens';
  }

  return outputDir;
};

const createDir = (tokensDir: string) => {
  if (!fs.existsSync(tokensDir)) {
    fs.mkdirSync(tokensDir, null);
    log(`Creating tokens directory: ${tokensDir}`, EMOJIS.success);
    return;
  }

  log('Tokens directory already exists', EMOJIS.success);
};

const getFullConfig = (cosmiconfigResult: CosmiconfigResult): Config => {
  if (!cosmiconfigResult) {
    throw customError(
      "Config file not found. Use a standard naming using the module name 'designtokensrc' like '.designtokensrc.json', more info in https://www.npmjs.com/package/cosmiconfig. Also you can specify a different one by using --config-file=FILENAME"
    );
  }

  if (cosmiconfigResult.isEmpty) {
    throw customError('Configuration file found but empty');
  }

  log(`Configuration file found: ${cosmiconfigResult.filepath}`, EMOJIS.success);
  return cosmiconfigResult.config as Config;
};

const getDesignTokensConfig = (
  cosmiconfigResult: {
    config: Config;
    filepath: string;
    isEmpty?: boolean;
  } | null
) => {
  const designTokensConfig = getFullConfig(cosmiconfigResult);
  const { figmaApiKey, figmaProjectId, outputDir, figmaPages } = designTokensConfig;
  const tokensDir = getTokensDir(outputDir);

  handleErrors(figmaApiKey, figmaProjectId, figmaPages);
  createDir(tokensDir);
  return designTokensConfig;
};

const configFileParser = async (argv: Arguments) => {
  const APP_DIR = path.resolve().split('/node_modules')[0];
  const configFilePath = getConfigFilePath(APP_DIR, argv);

  const explorer = cosmiconfig(CONFIG_FILE_DEFAULT);

  if (configFilePath !== '') {
    const cosmiconfigResult = await explorer.load(configFilePath);
    const designTokensConfig = getDesignTokensConfig(cosmiconfigResult);

    return new Promise<Config>(resolve => {
      resolve(designTokensConfig!);
    });
  }

  const cosmiconfigResult = await explorer.search(APP_DIR);
  const designTokensConfig = getDesignTokensConfig(cosmiconfigResult);

  return new Promise<Config>(resolve => {
    resolve(designTokensConfig!);
  });
};

export { configFileParser };
