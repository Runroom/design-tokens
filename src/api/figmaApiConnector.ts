import fetch from 'node-fetch';
import { Config, DesignTokensGenerator } from '@/types/designTokens';
import { parseFigma } from './parseFigma.ts';
import { EMOJIS, isFigmaResponse, log } from '@/functions';

type FigmaResponseError = { status: number; err?: string };

const isFigmaResponseError = (response: unknown): response is FigmaResponseError =>
  typeof response === 'object' && response !== null && 'status' in response && 'err' in response;

const checkFigmaErrors = (response: unknown) => {
  if (!isFigmaResponseError(response)) {
    return;
  }

  if (response.status !== 200) {
    throw new Error(`${response.status} - ${response.err}`);
  }
};

const figmaApiConnection = async ({
  figmaApiKey,
  figmaProjectId,
  figmaPages,
  darkMode
}: Config): Promise<DesignTokensGenerator[]> => {
  log('Connecting with Figma...', EMOJIS.workingInProgress);

  const url = `https://api.figma.com/v1/files/${figmaProjectId}`;
  const options = {
    method: 'GET',
    headers: {
      'X-Figma-Token': figmaApiKey
    }
  };

  try {
    const response = await fetch(url, options);
    log('Figma connection established', EMOJIS.success);

    const responseJson = await response.json();

    checkFigmaErrors(responseJson);

    if (!isFigmaResponse(responseJson)) {
      throw new Error(`No styles found`);
    }

    const parsedTokens = parseFigma(responseJson, figmaPages, darkMode);

    if (!parsedTokens || !parsedTokens.length) {
      throw new Error(`No styles found`);
    }

    return parsedTokens;
  } catch (err) {
    throw new Error(`\x1b[31m\n\n${EMOJIS.error} ${err}\n`);
  }
};

export { figmaApiConnection };
