import {
  CreateFile,
  DesignTokensGenerator,
  SpacingCollection,
  SpacingToken,
  TokenPayload
} from '@/types/designTokens';
import { FigmaSpacingComponent } from '@/types/figma';
import { getTokens, remify, snakeCase } from '@/functions';

const SPACING_TYPE = 'spacing';

const getBoundingWidth = (component: FigmaSpacingComponent): SpacingToken | false => {
  if (!(component && component.name)) {
    return false;
  }

  const name = snakeCase(component.name);
  const value = remify(component.absoluteBoundingBox.height);

  return {
    [name]: {
      name,
      type: SPACING_TYPE,
      value
    }
  };
};

const writeSpacingTokens =
  (tokens: SpacingCollection) =>
  (createFile: CreateFile, outputDir: string, name = 'spacings') => {
    return [createFile(name, tokens, outputDir, 'json')];
  };

const Spacings = ({ frame }: TokenPayload): DesignTokensGenerator => {
  const tokens = getTokens<FigmaSpacingComponent, SpacingCollection, SpacingToken>(
    'Spacings',
    frame,
    getBoundingWidth
  );

  return {
    name: 'Spacings',
    tokens,
    writeTokens: writeSpacingTokens(tokens)
  };
};

export { Spacings, SPACING_TYPE };
