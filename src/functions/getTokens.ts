import { FigmaComponent, FigmaFrame } from '@/types/figma';
import { DesignTokensGenerator, TokenCollection, Tokens, Truthy } from '@/types/designTokens';
import { snakeCase } from './stringManipulation.ts';
import { DESIGN_TOKENS, DesignPages } from '@/designTokensPages.ts';

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

      const newComponents = treeParser<T>(frame.children);
      if (newComponents) {
        components.push(...newComponents);
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
  name: DesignPages,
  pages: string[],
  frame: FigmaFrame,
  designToken: new (figmaFrame: FigmaFrame, themes?: string[] | undefined) => T,
  themes?: string[]
): T | undefined => {
  if (!pages.includes(name)) {
    return;
  }

  return new designToken(frame, themes);
};

const validateFrameName = (name: string): name is DesignPages =>
  Object.keys(DESIGN_TOKENS).includes(name);

const generateDesignTokens = (
  pages: string[],
  figmaDesignTokensFrames: FigmaFrame[],
  themes?: string[]
) => {
  const writeFilePromises: DesignTokensGenerator[] = figmaDesignTokensFrames
    .map(frame => {
      if (!validateFrameName(frame.name)) {
        return;
      }
      const frameName = frame.name;
      const classToken = DESIGN_TOKENS[frame.name];

      return designTokensBuilder<DesignTokensGenerator>(
        frameName,
        pages,
        frame,
        classToken,
        themes
      );
    })
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
