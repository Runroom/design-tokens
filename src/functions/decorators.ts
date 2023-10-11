import {
  camelCase,
  snakeCase,
  rgbaGenObject,
  fullColorHex,
  fullColorHsl,
  pixelate,
  remify,
  formatNumber
} from './utils.ts';

import {
  FigmaColorComponent,
  FigmaSpacingComponent,
  FigmaTypographyComponent
} from '@/types/figma';
import { SpacingToken } from '@/types/Spacing.ts';
import { ColorToken } from '@/types/Color.ts';
import { TypographyToken } from '@/types/Typography.ts';

const _getBoundingWidth = (component: FigmaSpacingComponent): SpacingToken | false => {
  if (!(component && component.name)) {
    return false;
  }

  const name = snakeCase(component.name);
  const value = pixelate(component.absoluteBoundingBox.width);
  const remValue = remify(component.absoluteBoundingBox.width);

  return {
    [name]: {
      value,
      remValue
    }
  };
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
  const name = camelCase(component.name);
  const rgbColor = rgbaGenObject(r, g, b, a);
  const hexColor = fullColorHex(rgbColor.r, rgbColor.g, rgbColor.b);
  const hslColor = fullColorHsl(rgbColor.r, rgbColor.g, rgbColor.b, rgbColor.a);

  return {
    [name]: {
      name: component.name,
      rgbColor,
      hexColor,
      hslColor
    }
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
      rawFontSize: formatNumber(fontSize),
      fontWeight,
      letterSpacing: letterSpacingRounded < 1 ? 0 : `${letterSpacingRounded}px`,
      lineHeight
    }
  };
};

const getSpacings = _getBoundingWidth;
const getBreakpoints = _getBoundingWidth;

export { getBreakpoints, getColors, getSpacings, getTypography };
