import { generateTokens, camelCase, rgbaGenObject, fullColorHex } from '../utils'

const getColors = (layerName, stylesArtboard) => {
  const decorator = element => {
    const { r, g, b, a } = element.children[0].fills[0].color;
    const colorRGBA = rgbaGenObject(r, g, b, a);
    return {
      [camelCase(element.name)]: {
        value: `${fullColorHex(colorRGBA.r, colorRGBA.g, colorRGBA.b)}`
      }
    };
  }

  return generateTokens(layerName, stylesArtboard, decorator);
}

export default getColors
