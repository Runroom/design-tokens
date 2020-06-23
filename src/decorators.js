import { camelCase, rgbaGenObject, fullColorHex, pixelate } from './utils';

const getColors = element => {
  const { r, g, b, a } = element.children[0].fills[0].color;
  const colorRGBA = rgbaGenObject(r, g, b, a);

  return {
    [camelCase(element.name)]: {
      value: `${fullColorHex(colorRGBA.r, colorRGBA.g, colorRGBA.b)}`
    }
  };
};

const getSpacings = element => ({
  [camelCase(element.name)]: { value: pixelate(element.absoluteBoundingBox.width) }
});

const getTypography = element => {
  const {
    fontFamily,
    fontSize,
    lineHeightPx,
    lineHeightPercentFontSize,
    fontWeight
  } = element.children[0].style;

  return {
    [camelCase(element.name)]: {
      fontFamily: { value: `'${fontFamily}'` },
      fontSize: { value: pixelate(fontSize) },
      lineHeight: { value: pixelate(Math.floor(lineHeightPx)) },
      lineHeightRelative: { value: Math.floor(lineHeightPercentFontSize) / 100 },
      fontWeight: { value: fontWeight }
    }
  }
};

const getBreakpoints = element => ({
  [camelCase(element.name)]: { value: pixelate(element.absoluteBoundingBox.width) }
});

export {
  getBreakpoints,
  getColors,
  getSpacings,
  getTypography
};
