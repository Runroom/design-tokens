import { generateTokens, camelCase } from '../utils'

const getTypography = (layerName, stylesArtboard) => {
  const palette = { typography: {} }
  const decorator = element => {
    const { name } = element
    const {
      fontFamily,
      fontSize,
      lineHeightPx,
      fontWeight
    } = element.children[0].style

    const tokens = {
      [camelCase(name)]: {
        fontFamily: { value: `'${fontFamily}'` },
        fontSize: { value: `${fontSize}px` },
        lineHeight: { value: `${Math.floor(lineHeightPx)}px` },
        fontWeight: { value: fontWeight }
      }
    }
    Object.assign(palette.typography, tokens)
  }

  return generateTokens(layerName, stylesArtboard, palette, decorator)
}

export default getTypography
