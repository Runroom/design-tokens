import { generateTokens, camelCase } from '../utils'

const getBreakpoints = (layerName, stylesArtboard) => {
  const breakpoints = { breakpoint: {} };
  const decorator = element => {
    const {name, absoluteBoundingBox} = element;
    const tokens = {
      [camelCase(name)]: {value: `${absoluteBoundingBox.width}px`}
    }
    Object.assign(breakpoints.breakpoint, tokens);
  }

  return generateTokens(layerName, stylesArtboard, breakpoints, decorator);
}

export default getBreakpoints
