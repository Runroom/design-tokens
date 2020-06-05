import { generateTokens, camelCase } from '../utils'

const getTypography = (layerName, stylesArtboard) => {
  const decorator = element => {
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

  return generateTokens(layerName, stylesArtboard, decorator);
}

export default getTypography;
