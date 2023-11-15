import { Config, DesignTokensGenerator, TokenCollection } from '@/types/designTokens';
import { promises as fsp } from 'fs';
import { EMOJIS, log } from './logger.ts';

const createFile = (
  name: string,
  payload: TokenCollection | string,
  outDir: string,
  ext = 'json'
) =>
  fsp.writeFile(
    `${outDir}/${name}.${ext}`,
    JSON.stringify(payload, null, 2).replace(/^"(.+(?="$))"$/, '$1')
  );

const writeBatch = async (files: Promise<void>[], success: string): Promise<void> => {
  try {
    await Promise.all(files);
    log(success, EMOJIS.success);
  } catch (err) {
    throw new Error(`\x1b[31m\n\n${EMOJIS.error} ${err}\n`);
  }
};

const createJsonTokenFiles = (
  generatedTokens: DesignTokensGenerator[],
  { outputDir }: Config
): Promise<void> => {
  const jsonFiles: Promise<void>[] = [];

  for (const token of generatedTokens) {
    jsonFiles.push(...token.writeTokens(createFile, outputDir));
  }

  return writeBatch(jsonFiles, 'JSON Tokens generated');
};

const createCssTokenFiles = (
  tokens: DesignTokensGenerator[],
  { outputDir }: Config
): Promise<void> => {
  const cssFiles: Promise<void>[] = [];

  for (const token of tokens) {
    cssFiles.push(...token.writeCssVariables(createFile, outputDir));
  }

  return writeBatch(cssFiles, 'CSS Tokens generated');
};

export { createFile, writeBatch, createJsonTokenFiles, createCssTokenFiles };
