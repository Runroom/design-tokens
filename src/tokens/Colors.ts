import {
  Color,
  ColorCollection,
  ColorToken,
  CreateFile,
  DesignTokensGenerator,
  TokenPayload
} from '@/types/designTokens';
import { FigmaColorComponent } from '@/types/figma';
import { fullColorHex, fullColorHsl, getTokens, rgbaGenObject } from '@/functions';

const COLOR_TYPE = 'color';

const buildColorToken = (component: FigmaColorComponent, tokenValue: Color): ColorToken => {
  const keys = component.name.split('-').reverse();

  return keys.reduce((acc: object, curr) => ({ [curr]: acc }), tokenValue) as ColorToken;
};

const getColors = (component: FigmaColorComponent): ColorToken | false => {
  if (
    !(
      component &&
      component.name &&
      component.children &&
      component.children.length &&
      component.children[0].fills &&
      component.children[0].fills.length
    )
  ) {
    return false;
  }

  const { r, g, b, a } = component.children[0].fills[0].color;
  const name = component.name;
  const rgbColor = rgbaGenObject(r, g, b, a);
  const hexColor = fullColorHex(rgbColor.r, rgbColor.g, rgbColor.b);
  const hslColor = fullColorHsl(rgbColor.r, rgbColor.g, rgbColor.b, rgbColor.a);
  const tokenValue: Color = {
    name,
    type: COLOR_TYPE,
    value: hexColor,
    valueRgb: rgbColor,
    valueHsl: hslColor
  };

  return buildColorToken(component, tokenValue);
};

const buildColorTokensWithThemes = (tokens: ColorCollection, themes: string[]) => {
  const tokensWithThemes: { [key: string]: ColorCollection } = {};

  themes.forEach(theme => {
    if (!tokens.colors[theme]) {
      return;
    }

    tokensWithThemes[theme] = {
      colors: tokens.colors[theme] as any
    } as ColorCollection;

    delete tokens.colors[theme];
  });

  tokensWithThemes.default = tokens;

  return tokensWithThemes;
};

const writeColorTokens =
  (tokens: ColorCollection, themes?: string[]) =>
  (createFile: CreateFile, outputDir: string, name = 'colors') => {
    if (themes && themes.length > 0) {
      const tokensWithThemes = buildColorTokensWithThemes(tokens, themes);

      return [createFile(name, tokensWithThemes, outputDir, 'json')];
    }

    return [createFile(name, tokens, outputDir, 'json')];
  };

const Colors = ({ frame, themes }: TokenPayload): DesignTokensGenerator => {
  const tokens = getTokens<FigmaColorComponent, ColorCollection, ColorToken>(
    'Colors',
    frame,
    getColors
  );

  return {
    name: 'Colors',
    tokens,
    writeTokens: writeColorTokens(tokens, themes)
  };
};

export { Colors, COLOR_TYPE };
