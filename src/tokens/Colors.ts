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
    value: hexColor,
    valueRgb: rgbColor,
    valueHsl: hslColor
  };

  return buildColorToken(component, tokenValue);
};

const buildColorTokensWithThemes = (tokens: ColorCollection) => {
  const tokensWithThemes: { [key: string]: ColorCollection } = {};

  tokensWithThemes['dark'] = {
    colors: tokens.colors['dark'] as any
  } as ColorCollection;

  delete tokens.colors['dark'];

  tokensWithThemes.default = tokens;

  return tokensWithThemes;
};

const getExt = (theme: string) => {
  if (theme === 'default') {
    return 'json';
  }

  return `${theme}.json`;
};

const writeColorTokens =
  (tokens: ColorCollection, darkMode?: boolean) =>
  (createFile: CreateFile, outputDir: string, name = 'colors') => {
    if (darkMode) {
      const tokensWithThemes = buildColorTokensWithThemes(tokens);

      return Object.keys(tokensWithThemes).map(theme =>
        createFile(name, tokensWithThemes[theme], outputDir, getExt(theme))
      );
    }

    return [createFile(name, tokens, outputDir, 'json')];
  };

const Colors = ({ frame, darkMode }: TokenPayload): DesignTokensGenerator => {
  const tokens = getTokens<FigmaColorComponent, ColorCollection, ColorToken>(
    'Colors',
    frame,
    getColors
  );

  return {
    name: 'Colors',
    tokens,
    writeTokens: writeColorTokens(tokens, darkMode)
  };
};

export { Colors };
