import { createRootString, getTokens, remify, snakeCase } from '@/functions';
import {
  BorderCollection,
  BorderToken,
  CreateFile,
  DesignTokensGenerator,
  TokenPayload
} from '@/types/designTokens';
import { FigmaBorderComponent } from '@/types/figma';

const generateCssBordersVariables = ({ borders }: BorderCollection) => {
  let bordersVars = '';
  const borderBaseName = '--border-radius';

  for (const key in borders) {
    const borderName = `${borderBaseName}-${key}`;
    const borderValue = borders[key].value;
    bordersVars = `${bordersVars}${borderName}: ${borderValue};`;
  }

  return {
    bordersVars: createRootString(bordersVars)
  };
};

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
      value
    }
  };
};

const writeBorderTokens =
  (tokens: BorderCollection) =>
  (createFile: CreateFile, outputDir: string, name = 'borders') => {
    return [createFile(name, tokens, outputDir, 'json')];
  };

const writeBorderVariables =
  (tokens: BorderCollection) =>
  (createFile: CreateFile, outputDir: string, name = 'borders-vars') => {
    const { bordersVars } = generateCssBordersVariables(tokens);
    return [createFile(name, bordersVars, outputDir, 'css')];
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
    writeTokens: writeBorderTokens(tokens),
    writeCssVariables: writeBorderVariables(tokens)
  };
};

export { Borders };
