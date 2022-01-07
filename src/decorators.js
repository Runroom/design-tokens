import {
  camelCase,
  snakeCase,
  rgbaGenObject,
  fullColorHex,
  pixelate,
  formatNumber
} from './utils.js';

const _getBoundingWidth = element => {
  if (element && element.name) {
    const name = snakeCase(element.name);
    const value = pixelate(element.absoluteBoundingBox.width);

    return { [name]: { value } };
  }

  return false;
};

const getColors = element => {
  if (element && element.name && element.children.length && element.children[0].fills.length) {
    const { r, g, b, a } = element.children[0].fills[0].color;
    const name = camelCase(element.name);
    const rgbColor = rgbaGenObject(r, g, b, a);
    const hexColor = fullColorHex(rgbColor.r, rgbColor.g, rgbColor.b);

    return {
      [name]: {
        name: element.name,
        rgbColor,
        hexColor
      }
    };
  }

  return false;
};

const getTypography = element => {
  if (element && element.name && element.children.length) {
    const { fontFamily, fontSize, letterSpacing, lineHeightPercentFontSize, fontWeight } =
      element.children[0].style;
    const lineHeight = Math.floor(lineHeightPercentFontSize) / 100;
    const letterSpacingRounded = Math.floor(letterSpacing);

    return {
      [camelCase(element.name)]: {
        fontFamily,
        fontSize: `${formatNumber(fontSize / 16)}rem`,
        rawFontSize: formatNumber(fontSize),
        fontWeight,
        letterSpacing: letterSpacingRounded < 1 ? 0 : `${letterSpacingRounded}px`,
        lineHeight
      }
    };
  }

  return false;
};

const getSpacings = _getBoundingWidth;
const getBreakpoints = _getBoundingWidth;

export { getBreakpoints, getColors, getSpacings, getTypography };
