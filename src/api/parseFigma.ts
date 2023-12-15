import { EMOJIS, log } from '@/functions/logger.ts';
import { FigmaResponse } from '@/types/figma';
import { generateDesignTokens } from '@/functions/getTokens.ts';
import { DesignTokensGenerator, FigmaPages } from '@/types/designTokens';

const parseFigma = (response: FigmaResponse, FIGMA_PAGES: FigmaPages, darkMode?: boolean) => {
  if (!response) {
    throw new Error(`\x1b[31m\n\n${EMOJIS.error} No styles found\n`);
  }

  if (response.status === 403 || response.status === 404) {
    throw new Error(`\x1b[31m\n\n${EMOJIS.error} ${response.status}\n\x1b[0m`);
  }

  const figmaTree = response.document.children;
  const tokens: DesignTokensGenerator[] = [];

  log('Parsing Figma tokens...', EMOJIS.workingInProgress);

  for (const page in FIGMA_PAGES) {
    const figmaPage = figmaTree.find(figmaPage => figmaPage.name === page);

    if (figmaPage === undefined) {
      throw new Error(`There is no page called '${page}'`);
    }

    const frames = FIGMA_PAGES[page];
    if (!figmaPage.children || figmaPage.children.length === 0) {
      return;
    }

    const figmaDesignTokensFrames = figmaPage.children;
    const generateTokens = generateDesignTokens(frames, figmaDesignTokensFrames, darkMode);
    tokens.push(...generateTokens);
  }

  return tokens;
};

export { parseFigma };
