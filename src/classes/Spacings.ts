import {
  CreateFile,
  DesignTokensGenerator,
  SpacingCollection,
  SpacingToken,
  TokenPayload
} from '@/types/designTokens';
import { FigmaSpacingComponent } from '@/types/figma';
import { createRootString, getTokens, pixelate, remify, snakeCase } from '@/functions';

const generateCssSpacingVariables = ({ spacings }: SpacingCollection) => {
  let spacingsVars = '';
  const spacingBaseName = 'spacing';

  for (const key in spacings) {
    const spacingVarsName = `--${spacingBaseName}-${key}`;
    const spacingRemValue = `${spacingVarsName}: ${spacings[key].remValue}`;
    spacingsVars = `${spacingsVars}${spacingRemValue};`;
  }

  return {
    spacingsVars: createRootString(spacingsVars)
  };
};

const getBoundingWidth = (component: FigmaSpacingComponent): SpacingToken | false => {
  if (!(component && component.name)) {
    return false;
  }

  const name = snakeCase(component.name);
  const value = pixelate(component.absoluteBoundingBox.height);
  const remValue = remify(component.absoluteBoundingBox.height);

  return {
    [name]: {
      value,
      remValue
    }
  };
};

const writeSpacingTokens =
  (tokens: SpacingCollection) =>
  (createFile: CreateFile, outputDir: string, name = 'spacings') => {
    return [createFile(name, tokens, outputDir, 'json')];
  };

const writeSpacingVariables =
  (tokens: SpacingCollection) =>
  (createFile: CreateFile, outputDir: string, name = 'spacings-vars') => {
    const { spacingsVars } = generateCssSpacingVariables(tokens);
    return [createFile(name, spacingsVars, outputDir, 'css')];
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
    writeTokens: writeSpacingTokens(tokens),
    writeCssVariables: writeSpacingVariables(tokens)
  };
};

export { Spacings };
