import { camelCase, rgbaGenObject, fullColorHex } from './utils';

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
  [camelCase(element.name)]: { value: `${element.absoluteBoundingBox.width}px` }
});

const getTypography = element => {
  const {
    fontFamily,
    fontSize,
    lineHeightPx,
    fontWeight
  } = element.children[0].style;

  return {
    [camelCase(element.name)]: {
      fontFamily: { value: `'${fontFamily}'` },
      fontSize: { value: `${fontSize}px` },
      lineHeight: { value: `${Math.floor(lineHeightPx)}px` },
      fontWeight: { value: fontWeight }
    }
  }
};

export {
  getColors,
  getSpacings,
  getTypography
};
