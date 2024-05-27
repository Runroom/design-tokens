import { FigmaComponent, FigmaFrame } from '@/types/figma';
import {
  DesignTokensGenerator, Token,
  TokenCollection,
  TokenPayload,
  Tokens,
  Truthy
} from '@/types/designTokens';
import { snakeCase } from './stringManipulation.ts';
import { DESIGN_TOKENS, DesignPages } from '@/designTokensPages.ts';
import { validateFrameName } from './ensureType.ts';
import { logWarning } from '@/functions/logger.ts';

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

const buildPayload = <P extends TokenCollection>(payload: object, componentsKey: string): P => {
  return {
    [componentsKey]: payload
  } as P;
};

const isKeyDuplicated = <T extends TokenCollection, K extends Tokens>(payload: T, token: K, key: string) => Object.keys(payload).filter(payloadKey => payloadKey === (token[key] as any).name).length;

const renameDuplicatedToken = <T extends TokenCollection, K extends Tokens>(payload: T, token: K) => {
  let duplicatedToken = token;
  Object.keys(payload).forEach((key) => {
    const payloadToken= payload[key] as any as Token;

    if (payloadToken.name === (duplicatedToken[key] as Token).name) {
      const duplicatedKey = `${key}-duplicate`;
      (duplicatedToken[key] as Token).name = `${(duplicatedToken[key] as Token).name}-duplicate`;
      duplicatedToken = { [duplicatedKey]: duplicatedToken[key] } as K;
    }
  });

  return duplicatedToken;
};

const mergeTokens = <T extends TokenCollection, K extends Tokens>(payload: T, token: K): T => {
  const key = Object.keys(token)[0];

  if (!payload[key]) {
    Object.assign(payload, token);

    return payload;
  }

  if (isKeyDuplicated(payload, token, key)) {
    logWarning(`Duplicated token name: ${(token[key] as Token).name}`);
    const duplicatedToken = renameDuplicatedToken(payload, token);

    Object.assign(payload, duplicatedToken);
    return (payload);
  }

  const newPayload: T = mergeTokens(payload[key] as T, token[key] as K);

  return {
    ...payload,
    [key]: newPayload
  };
};

const getTokens = <T extends FigmaComponent, P extends TokenCollection, K extends Tokens>(
  artBoardName: string,
  artBoard: FigmaFrame,
  decorator: (component: T) => K | false
): P => {
  const components = getComponents<T>(artBoard);
  const componentsKey = snakeCase(artBoardName);
  let payload = {} as P;

  components.map(component => {
    const data = decorator(component);

    if (data) {
      payload = mergeTokens(payload, data);
    }
  });

  return buildPayload(payload, componentsKey);
};

const truthy = <T>(value: T): value is Truthy<T> => !!value;

const designTokensBuilder = <T>(
  name: DesignPages,
  pages: string[],
  frame: FigmaFrame,
  designToken: ({ frame, themes }: TokenPayload) => T,
  themes?: string[]
): T | undefined => {
  if (!pages.includes(name)) {
    return;
  }

  return designToken({ frame, themes });
};

const generateDesignTokens = (
  pages: string[],
  figmaDesignTokensFrames: FigmaFrame[],
  figmaThemes?: string[]
) => {
  const writeFilePromises: DesignTokensGenerator[] = figmaDesignTokensFrames
    .map(frame => {
      if (!validateFrameName(frame.name)) {
        return;
      }
      const frameName = frame.name;
      const tokenGenerator = DESIGN_TOKENS[frame.name];

      return designTokensBuilder<DesignTokensGenerator>(
        frameName,
        pages,
        frame,
        tokenGenerator,
        figmaThemes
      );
    })
    .filter(truthy);

  return writeFilePromises;
};

export { generateDesignTokens, getTokens, truthy, designTokensBuilder, getComponents };
