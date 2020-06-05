import { generateTokens, camelCase } from '../utils'

const getSpacing = (layerName, stylesArtboard) => {
  const decorator = element => ({
    [camelCase(element.name)]: { value: `${element.absoluteBoundingBox.width}px` }
  });

  return generateTokens(layerName, stylesArtboard, decorator);
}

export default getSpacing;
