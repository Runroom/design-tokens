import fetch from 'node-fetch';
import { FigmaResponse } from '@/types/figma';
import { EMOJIS, log } from '@/functions/logger.ts';
import parseFigmaResponse from '@/api/parseFigmaResponse.ts';
import { Config } from '@/types/designTokens';

const isFigmaResponse = (response: unknown): response is FigmaResponse => {
  if (typeof response !== 'object') {
    return false;
  }

  if (!((response as FigmaResponse).document || (response as FigmaResponse).document.children)) {
    return false;
  }

  return true;
};

const figmaApiConnection = async ({
  FIGMA_APIKEY,
  FIGMA_ID,
  FIGMA_PAGE_NAME,
  pages,
  themes
}: Config) => {
  log('Connecting with Figma...', EMOJIS.workingInProgress);

  const url = `https://api.figma.com/v1/files/${FIGMA_ID}`;
  const options = {
    method: 'GET',
    headers: {
      'X-Figma-Token': FIGMA_APIKEY
    }
  };

  try {
    const response = await fetch(url, options);
    log('Figma connection established', EMOJIS.success);
    const responseJson = await response.json();

    if (!isFigmaResponse(responseJson)) {
      throw new Error(`No styles found`);
    }

    const parsedTokens = parseFigmaResponse(responseJson, FIGMA_PAGE_NAME, pages, themes);

    if (!parsedTokens || !parsedTokens.length) {
      throw new Error(`No styles found`);
    }

    return parsedTokens;
  } catch (err) {
    throw new Error(`\x1b[31m\n\n${EMOJIS.error} ${err}\n`);
  }
};

export default figmaApiConnection;
