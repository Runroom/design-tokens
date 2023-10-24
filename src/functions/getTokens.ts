import { FigmaComponent, FigmaFrame } from '@/types/figma';
import { DesignTokensGenerator, TokenCollection, Tokens, Truthy } from '@/types/designTokens';
import { snakeCase } from './stringManipulation.ts';
import { designTokensPages } from '@/designTokensPages.ts';

const getFigmaFrame = (figmaFrames: FigmaFrame[], name: string): FigmaFrame | undefined =>
  figmaFrames.filter(item => item.name === name)[0];

const treeParser = <T extends FigmaComponent>(frames: (FigmaFrame | FigmaComponent)[]): T[] => {
  const components: T[] = [];

  for (const frame of frames) {
    if (frame.type === 'COMPONENT' || frame.type === 'INSTANCE') {
      components.push(frame as T);
      continue;
    }

    if (frame.type === 'FRAME' || frame.type === 'GROUP') {
      if (!frame.children) {
        continue;
      }

      const component = treeParser<T>(frame.children);
      if (component) {
        components.push(...component);
      }
    }
  }

  return components;
};

const getComponents = <T extends FigmaComponent>(artBoard: FigmaFrame): T[] => {
  if (!artBoard || !artBoard.children) {
    return [];
  }

  const frames = artBoard.children;

  return treeParser<T>(frames);
};

const initPayload = <P extends TokenCollection>(componentsIndex: string): P => {
  const payload: P = {} as P;
  Object.assign(payload, { [componentsIndex]: {} });
  return payload;
};

const getTokens = <T extends FigmaComponent, P extends TokenCollection, K extends Tokens>(
  artBoardName: string,
  artBoard: FigmaFrame,
  decorator: (component: T) => K | false
): P => {
  const components = getComponents<T>(artBoard);
  const componentsIndex = snakeCase(artBoardName);
  const payload = initPayload<P>(componentsIndex);

  components.map(component => {
    const data = decorator(component);

    if (data) {
      Object.assign(payload[componentsIndex], data);
    }
  });

  return payload;
};

const truthy = <T>(value: T): value is Truthy<T> => !!value;

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
  const writeFilePromises: DesignTokensGenerator[] = designTokensPages
    .map(designToken =>
      designTokensBuilder(
        designToken.name,
        pages,
        figmaDesignTokensFrames,
        designToken.class,
        themes
      )
    )
    .filter(truthy);

  return writeFilePromises;
};

export {
  generateDesignTokens,
  getTokens,
  getFigmaFrame,
  truthy,
  designTokensBuilder,
  getComponents
};
