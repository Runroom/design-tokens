import { snakeCase, rgbaGenObject, fullColorHex, pixelate } from './utils';

const _getBoundingWidth = element => {
  let name = 'empty_name';
  let value = 'empty_value';

  if (element && element.name) {
    name = snakeCase(element.name);
    value = pixelate(element.absoluteBoundingBox.width);
  }

  return { [name]: { value } };
};

const getColors = element => {
  let name = 'empty_name';
  let value = 'empty_value';

  if (element && element.name && element.children.length && element.children[0].fills.length) {
    const { r, g, b, a } = element.children[0].fills[0].color;
    const colorRGBA = rgbaGenObject(r, g, b, a);
    name = snakeCase(element.name);
    value = fullColorHex(colorRGBA.r, colorRGBA.g, colorRGBA.b);
  }

  return {
    [name]: { value }
  };
};

const getTypography = element => {
  let name = 'empty_name';
  let value = 'empty_value';

  if (element && element.name && element.children.length) {
    const {
      fontFamily,
      fontSize,
      letterSpacing,
      lineHeightPx,
      lineHeightPercentFontSize,
      fontWeight
    } = element.children[0].style;

    name = snakeCase(element.name);
    value = {
      fontFamily: { value: `'${fontFamily}'` },
      fontSize: { value: pixelate(fontSize) },
      letterSpacing: { value: pixelate(letterSpacing) },
      lineHeight: { value: pixelate(Math.floor(lineHeightPx)) },
      lineHeightRelative: { value: Math.floor(lineHeightPercentFontSize) / 100 },
      fontWeight: { value: fontWeight }
    };
  }

  return {
    [name]: value
  };
};

const getSpacings = _getBoundingWidth;
const getBreakpoints = _getBoundingWidth;

export { getBreakpoints, getColors, getSpacings, getTypography };
