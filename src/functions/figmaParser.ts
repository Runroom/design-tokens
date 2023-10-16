import { FigmaComponent, FigmaFrame } from '@/types/figma';
import { GenerateTokens, Token } from '@/types/Token.ts';
import { snakeCase } from './stringManipulation.ts';

const filterArtBoards = <T extends FigmaComponent>(
  artBoardName: string,
  stylesArtBoard: FigmaFrame[]
): T[] => {
  const artBoard = stylesArtBoard.filter(item => item.name === artBoardName)[0];

  if (!artBoard || !artBoard.children) {
    return [];
  }

  const components = artBoard.children as T[];

  return components.filter(item => item.type === 'COMPONENT');
};

const initPayload = <P extends GenerateTokens>(componentsIndex: string): P => {
  const payload: P = {} as P;
  Object.assign(payload, { [componentsIndex]: {} });
  return payload;
};

const generateTokens = <T extends FigmaComponent, P extends GenerateTokens, K extends Token>(
  artBoardName: string,
  stylesArtBoard: FigmaFrame[],
  decorator: (component: T) => K | false
): P => {
  const components = filterArtBoards<T>(artBoardName, stylesArtBoard);
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

export { generateTokens };
