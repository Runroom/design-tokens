import { FigmaComponent, FigmaFrame } from '@/types/figma';
import { GenerateTokens, Token } from '@/types/designTokens';
import { snakeCase } from './stringManipulation.ts';

const getComponents = <T extends FigmaComponent>(artBoard: FigmaFrame): T[] => {
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

const getTokens = <T extends FigmaComponent, P extends GenerateTokens, K extends Token>(
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

export { getTokens };
