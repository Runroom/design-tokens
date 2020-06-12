const filterArtboardElements = (artboardName, stylesArtboard) => stylesArtboard
  .filter(item => item.name === artboardName)[0].children
  .filter(item => item.type === 'COMPONENT');

const generateTokens = (artboardName, stylesArtboard, decorator) => {
  const elementName = camelCase(artboardName);
  const tokens = {
    [elementName]: {}
  };
  const elements = filterArtboardElements(artboardName, stylesArtboard);
  elements.map(element => {
    Object.assign(tokens[elementName], decorator(element));
  });

  return tokens;
}

const camelCase = string => {
  const stringUpdate = string
    .toLowerCase()
    .replace(/(?:(^.)|([-_\s]+.))/g, match =>
      match.charAt(match.length - 1).toUpperCase()
    )
  return stringUpdate.charAt(0).toLowerCase() + stringUpdate.substring(1)
};

const trim = str => str.replace(/^\s+|\s+$/gm, '')

const rgbaGen = (r, g, b, a) => {
  const getColor = color => Math.round(color * 255)
  return `rgba(${getColor(r)}, ${getColor(g)}, ${getColor(b)}, ${a})`
};

const rgbaGenObject = (r, g, b, a) => {
  const getColor = color => Math.round(color * 255)
  return { r: getColor(r), g: getColor(g), b: getColor(b), a: a }
};

const rgbGen = (r, g, b) => {
  const getColor = color => Math.round(color * 255)
  return `rgba(${getColor(r)}, ${getColor(g)}, ${getColor(b)})`
};

const rgbToHex = rgb => {
  const hex = Number(rgb).toString(16)
  return hex.length < 2 ? `0${hex}` : hex
};

const fullColorHex = (r, g, b) => {
  const red = rgbToHex(r);
  const green = rgbToHex(g);
  const blue = rgbToHex(b);
  const hexColor = `${red + green + blue}`.toLocaleLowerCase();

  if (red === green && green === blue && red === blue) {
    return `#${hexColor.slice(0, 3)}`;
  }
  return `#${hexColor}`;
};

const parseRGBA = color => {
  const { r, g, b, a } = color;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

const genShadow = (color, offset, radius) => {
  const { x, y } = offset;
  return `${x}px ${y}px ${radius}px ${parseRGBA(color)}`;
};

const pixelate = value => `${Math.floor(value)}px`;

const emojis = {
  color: '🎨',
  typography: '🖋 ',
  spacing: '📐',
  breakpoint: '🍪',
  success: '✅',
  error: '❌',
  warning: '⚠️'
};

module.exports = {
  generateTokens,
  camelCase,
  trim,
  rgbaGen,
  rgbaGenObject,
  rgbGen,
  rgbToHex,
  fullColorHex,
  parseRGBA,
  genShadow,
  pixelate,
  emojis
};
