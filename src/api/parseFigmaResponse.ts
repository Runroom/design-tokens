import { EMOJIS, log } from '@/functions/logger.ts';
import { FigmaFrame, FigmaResponse } from '@/types/figma';
import { Colors } from '@/classes/Colors.ts';
import { Typographies } from '@/classes/Typographies.ts';
import { Spacings } from '@/classes/Spacings.ts';
import { Breakpoints } from '@/classes/Breakpoints.ts';
import { DesignTokensGenerator } from '@/classes/DesignTokens.ts';

type Truthy<T> = T extends false | '' | 0 | null | undefined ? never : T;

const truthy = <T>(value: T): value is Truthy<T> => !!value;

const getFigmaFrame = (figmaFrames: FigmaFrame[], name: string): FigmaFrame | undefined =>
  figmaFrames.filter(item => item.name === name)[0];

const designTokensBuilder = <T>(
  name: string,
  pages: string[],
  figmaDesignTokensFrames: FigmaFrame[],
  designToken: new (frame: FigmaFrame, themes?: string[]) => T,
  themes?: string[]
): T | undefined => {
  if (!pages.includes(name)) {
    return;
  }
  const artBoard = getFigmaFrame(figmaDesignTokensFrames, name);
  if (!artBoard) {
    return;
  }
  return new designToken(artBoard, themes);
};

const generateDesignTokens = (
  pages: string[],
  figmaDesignTokensFrames: FigmaFrame[],
  themes?: string[]
) => {
  const writeFilePromises: DesignTokensGenerator[] = [
    designTokensBuilder('Colors', pages, figmaDesignTokensFrames, Colors, themes),
    designTokensBuilder('Typography', pages, figmaDesignTokensFrames, Typographies, themes),
    designTokensBuilder('Spacings', pages, figmaDesignTokensFrames, Spacings, themes),
    designTokensBuilder('Breakpoints', pages, figmaDesignTokensFrames, Breakpoints, themes)
  ].filter(truthy);

  return writeFilePromises;
};

const parseFigmaResponse = (
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

export default parseFigmaResponse;
