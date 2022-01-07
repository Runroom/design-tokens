import { promises as fsp } from 'fs';

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

const formatNumber = n => parseFloat(parseFloat(n).toFixed(5));

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

const filterArtboards = (artboardName, stylesArtboard) =>
  stylesArtboard
    .filter(item => item.name === artboardName)[0]
    .children.filter(item => item.type === 'COMPONENT');

const generateTokens = (artboardName, stylesArtboard, decorator) => {
  const elements = filterArtboards(artboardName, stylesArtboard);
  const elementName = snakeCase(artboardName);
  const payload = {
    [elementName]: {}
  };

  elements.map(element => {
    const data = decorator(element);

    if (data) {
      Object.assign(payload[elementName], data);
    }
  });

  return payload;
};

const generateCSSVariables = ({ colors }) => {
  const tailwind = {};
  let vars = '';
  let hexVars = '';

  Object.keys(colors).map(key => {
    const { r, g, b } = colors[key].rgbColor;
    const cssVarName = `--${colors[key].name}`;

    vars = `${vars}${cssVarName}: ${r}, ${g}, ${b};`;
    hexVars = `${hexVars}${cssVarName}: ${colors[key].hexColor};`;
    tailwind[key] = `rgb(var(${cssVarName}))`;
  });

  return {
    vars: `:root{${vars}}`,
    hexVars: `:root{${hexVars}}`,
    tailwind
  };
};

const createFile = (name, payload, outDir, ext = 'json') =>
  fsp.writeFile(`${outDir}/${name}.${ext}`, JSON.stringify(payload, null, 2), err => {
    if (err) throw new Error(`\x1b[31m${emojis.error} ${err}\n\n`);
    console.log(` ${emojis[name]} ${name} tokens created!`);
  });

export {
  camelCase,
  createFile,
  emojis,
  filterArtboards,
  formatNumber,
  fullColorHex,
  generateCSSVariables,
  generateTokens,
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
