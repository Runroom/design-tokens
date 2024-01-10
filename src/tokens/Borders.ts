import { getTokens, remify, snakeCase } from '@/functions';
import {
  BorderCollection,
  BorderToken,
  CreateFile,
  DesignTokensGenerator,
  TokenPayload
} from '@/types/designTokens';
import { FigmaBorderComponent } from '@/types/figma';

const BORDER_TYPE = 'border';

const getBoundingWidth = (component: FigmaBorderComponent): BorderToken | false => {
  if (!(component && component.name)) {
    return false;
  }

  const corner = component.cornerRadius
    ? component.cornerRadius
    : component.children
      ? component.children[0].cornerRadius
      : 0;

  const name = snakeCase(component.name);
  const value = remify(corner);

  return {
    [name]: {
      name,
      type: BORDER_TYPE,
      value
    }
  };
};

const writeBorderTokens =
  (tokens: BorderCollection) =>
  (createFile: CreateFile, outputDir: string, name = 'borders') => {
    return [createFile(name, tokens, outputDir, 'json')];
  };

const Borders = ({ frame }: TokenPayload): DesignTokensGenerator => {
  const tokens = getTokens<FigmaBorderComponent, BorderCollection, BorderToken>(
    'Borders',
    frame,
    getBoundingWidth
  );

  return {
    name: 'Borders',
    tokens,
    writeTokens: writeBorderTokens(tokens)
  };
};

export { Borders, BORDER_TYPE };
