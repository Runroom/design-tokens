import {
  CreateFile,
  DesignTokensGenerator,
  TokenPayload,
  Typography,
  TypographyCollection,
  TypographyToken
} from '@/types/designTokens';
import { FigmaTypographyComponent } from '@/types/figma';
import { camelCase, getTokens, remify } from '@/functions';
import { Parser, ParserOptions } from 'style-dictionary/types/Parser';
import { DesignTokens } from 'style-dictionary/types/DesignToken';

const TYPOGRAPHIES_NAME = 'typographies';

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
      value: {
        fontFamily,
        fontSize: remify(fontSize),
        fontWeight,
        letterSpacing: letterSpacingRounded < 1 ? 0 : `${letterSpacingRounded}px`,
        lineHeight
      }
    }
  };
};

const writeTokens =
  (tokens: TypographyCollection) =>
  (createFile: CreateFile, outputDir: string, name = TYPOGRAPHIES_NAME) => {
    return [createFile(name, tokens, outputDir, 'json')];
  };

const getTypographiesParser = (): Parser => {
  const pattern = new RegExp(`${TYPOGRAPHIES_NAME}.json$`);

  return {
    pattern,
    parse: ({ contents }: ParserOptions) => {
      const { typography } = JSON.parse(contents);
      const output: DesignTokens = {};

      Object.keys(typography).forEach(key => {
        const font: Typography = typography[key];

        output[`font-${key}-size`] = {
          value: font.value.fontSize
        };
        output[`font-${key}-weight`] = {
          value: font.value.fontWeight
        };
        output[`font-${key}-line-height`] = {
          value: font.value.lineHeight
        };
        output[`font-${key}-letter-spacing`] = {
          value: font.value.letterSpacing
        };
      });

      return output;
    }
  };
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
    writeTokens: writeTokens(tokens)
  };
};

export { Typographies, getTypographiesParser };
