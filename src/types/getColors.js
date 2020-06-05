import { generateTokens, camelCase, rgbaGenObject, fullColorHex } from '../utils'

const getColors = (layerName, stylesArtboard) => {
  const colors = { color: {} };
  const decorator = element => {
    const { r, g, b, a } = element.children[0].fills[0].color;
    const colorRGBA = rgbaGenObject(r, g, b, a);
    const tokens = {
      [camelCase(element.name)]: {
        value: `${fullColorHex(colorRGBA.r, colorRGBA.g, colorRGBA.b)}`
      }
    };
    Object.assign(colors.color, tokens);
  }

  return generateTokens(layerName, stylesArtboard, colors, decorator);
}

export default getColors
