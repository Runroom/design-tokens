const camelCase = string => {
  const stringUpdate = string
    .toLowerCase()
    .replace(/(?:(^.)|([-_\s]+.))/g, match => match.charAt(match.length - 1).toUpperCase());
  return stringUpdate.charAt(0).toLowerCase() + stringUpdate.substring(1);
};

const snakeCase = string =>
  string
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    .map(ch => ch.toLowerCase())
    .join('_');

const trim = str => str.replace(/^\s+|\s+$/gm, '');

const getColor = color => Math.round(color * 255);

const rgbaGen = (r, g, b, a = 1) => `rgba(${getColor(r)}, ${getColor(g)}, ${getColor(b)}, ${a})`;

const rgbaGenObject = (r, g, b, a = 1) => ({ r: getColor(r), g: getColor(g), b: getColor(b), a });

const rgbToHex = c => {
  const hex = Number(c).toString(16);
  return hex.length < 2 ? `0${hex}` : hex;
};

const fullColorHex = (r, g, b) => {
  const red = rgbToHex(r);
  const green = rgbToHex(g);
  const blue = rgbToHex(b);

  const redReduced = [...new Set(red.split(''))].join('');
  const greenReduced = [...new Set(green.split(''))].join('');
  const blueReduced = [...new Set(blue.split(''))].join('');

  if (redReduced.length === 1 && greenReduced.length === 1 && blueReduced.length === 1) {
    return `#${redReduced + greenReduced + blueReduced}`.toLocaleLowerCase();
  } else {
    return `#${red + green + blue}`.toLocaleLowerCase();
  }
};

const parseRgba = color => {
  const { r, g, b, a } = color;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

const genShadow = (color, offset, radius) => {
  const { x, y } = offset;
  return `${x}px ${y}px ${radius}px ${parseRgba(color)}`;
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
  camelCase,
  emojis,
  fullColorHex,
  genShadow,
  getColor,
  rgbaGen,
  rgbaGenObject,
  rgbToHex,
  parseRgba,
  pixelate,
  snakeCase,
  trim
};
