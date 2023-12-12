import {
  ColorCollection,
  ColorToken,
  CreateFile,
  DesignTokensGenerator,
  TokenPayload
} from '@/types/designTokens';
import { FigmaColorComponent } from '@/types/figma';
import { camelCase, fullColorHex, fullColorHsl, getTokens, rgbaGenObject } from '@/functions';

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
  const name = camelCase(component.name);
  const rgbColor = rgbaGenObject(r, g, b, a);
  const hexColor = fullColorHex(rgbColor.r, rgbColor.g, rgbColor.b);
  const hslColor = fullColorHsl(rgbColor.r, rgbColor.g, rgbColor.b, rgbColor.a);

  return {
    [name]: {
      name: component.name,
      value: hexColor,
      valueRgb: rgbColor,
      valueHsl: hslColor
    }
  };
};

const writeColorTokens =
  (tokens: ColorCollection) =>
  (createFile: CreateFile, outputDir: string, name = 'colors') => {
    return [createFile(name, tokens, outputDir, 'json')];
  };

const Colors = ({ frame }: TokenPayload): DesignTokensGenerator => {
  const tokens = getTokens<FigmaColorComponent, ColorCollection, ColorToken>(
    'Colors',
    frame,
    getColors
  );

  return {
    name: 'Colors',
    tokens,
    writeTokens: writeColorTokens(tokens)
  };
};

export { Colors };
