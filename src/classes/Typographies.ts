import {
  CreateFile,
  DesignTokensGenerator,
  TokenPayload,
  Typography,
  TypographyCollection,
  TypographyToken
} from '@/types/designTokens';
import { FigmaTypographyComponent } from '@/types/figma';
import { camelCase, createRootString, getTokens, kebabCase, remify } from '@/functions';

const generateCssTypographyVariables = ({ typography }: TypographyCollection) => {
  let typographyVars = '';

  for (const key in typography) {
    const typographyBaseName = `--${kebabCase(key)}`;
    const typographyBaseValue = typography[key];

    for (const prop in typography[key]) {
      const propName = `${typographyBaseName}-${kebabCase(prop)}`;
      const typographyValue = typographyBaseValue[prop as keyof Typography];
      typographyVars = `${typographyVars}${propName}: ${typographyValue};`;
    }
  }

  return {
    typographyVars: createRootString(typographyVars)
  };
};

const getTypography = (component: FigmaTypographyComponent): TypographyToken | false => {
  if (!(component && component.name && component.children && component.children.length)) {
    return false;
  }

  const token = component.children[0];

  if (!token.style) {
    return false;
  }

  const { fontFamily, fontSize, letterSpacing, lineHeightPercentFontSize, fontWeight } =
    token.style;
  const lineHeight = Math.floor(lineHeightPercentFontSize) / 100;
  const letterSpacingRounded = Math.floor(letterSpacing);

  return {
    [camelCase(component.name)]: {
      fontFamily,
      fontSize: remify(fontSize),
      fontWeight,
      letterSpacing: letterSpacingRounded < 1 ? 0 : `${letterSpacingRounded}px`,
      lineHeight
    }
  };
};

const writeTokens =
  (tokens: TypographyCollection) =>
  (createFile: CreateFile, outputDir: string, name = 'typographies') => {
    return [createFile(name, tokens, outputDir, 'json')];
  };

const writeCssVariables =
  (tokens: TypographyCollection) =>
  (createFile: CreateFile, outputDir: string, name = 'typographies-vars') => {
    const { typographyVars } = generateCssTypographyVariables(tokens);
    return [createFile(name, typographyVars, outputDir, 'css')];
  };

const Typographies = ({ frame }: TokenPayload): DesignTokensGenerator => {
  const tokens = getTokens<FigmaTypographyComponent, TypographyCollection, TypographyToken>(
    'Typography',
    frame,
    getTypography
  );

  return {
    name: 'Typographies',
    tokens,
    writeTokens: writeTokens(tokens),
    writeCssVariables: writeCssVariables(tokens)
  };
};

export { Typographies };
