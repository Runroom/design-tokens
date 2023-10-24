import { EMOJIS, log } from '@/functions/logger.ts';
import { FigmaResponse } from '@/types/figma';
import { generateDesignTokens } from '@/functions/getTokens.ts';

const parseFigma = (
  response: FigmaResponse,
  figmaPageName: string,
  pages: string[],
  themes?: string[]
) => {
  if (!response) {
    throw new Error(`\x1b[31m\n\n${EMOJIS.error} No styles found\n`);
  }

  if (response.status === 403 || response.status === 404) {
    throw new Error(`\x1b[31m\n\n${EMOJIS.error} ${response.status}\n\x1b[0m`);
  }

  const figmaTree = response.document.children.filter(page => page.name === figmaPageName);

  if (figmaTree.length === 0) {
    throw new Error(`There is no page called '${figmaPageName}'`);
  }

  log('Parsing Figma tokens...', EMOJIS.workingInProgress);

  const figmaDesignTokensPage = figmaTree[0];

  if (!figmaDesignTokensPage.children || figmaDesignTokensPage.children.length === 0) {
    return;
  }

  const figmaDesignTokensFrames = figmaDesignTokensPage.children;
  return generateDesignTokens(pages, figmaDesignTokensFrames, themes);
};

export { parseFigma };
