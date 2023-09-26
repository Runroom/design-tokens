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
  }

  return `#${red + green + blue}`.toLocaleLowerCase();
};

const fullColorHsl = (r, g, b) => {
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;

  var max = Math.max(red, green, blue),
    min = Math.min(red, green, blue);
  var h,
    s,
    l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case red:
        h = (green - blue) / d + (green < blue ? 6 : 0);
        break;
      case green:
        h = (blue - red) / d + 2;
        break;
      case blue:
        h = (red - green) / d + 4;
        break;
    }

    h /= 6;
  }

  return [h, s, l];
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

const remify = value => `${formatNumber(value / 16)}rem`;

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

const createThemeRootString = (theme, vars, defaultTheme) =>
  `:root[data-theme='${theme}']{${vars} ${defaultTheme ? `color-scheme: ${theme};` : ''}}`;

const generateCSSVariables = ({ colors }, themes) => {
  const tailwind = {};
  let vars = '';
  let hexVars = '';
  let hslVars = '';

  const applyTheme =
    themes && themes.length
      ? themes.reduce((acc, theme) => {
          return {
            ...acc,
            [theme]: {
              vars: '',
              hexVars: '',
              hslVars: '',
              tailwind: {}
            }
          };
        }, {})
      : {};

  Object.keys(colors).map(key => {
    const { r, g, b } = colors[key].rgbColor;
    let cssVarName = `--${colors[key].name}`;

    if (Object.keys(applyTheme).length) {
      let cssVarNameTheme = cssVarName.split('-')[2];
      if (themes.includes(cssVarNameTheme)) {
        cssVarName = cssVarName.replace(`${cssVarNameTheme}-`, '');

        applyTheme[
          cssVarNameTheme
        ].vars = `${applyTheme[cssVarNameTheme].vars}${cssVarName}: ${r}, ${g}, ${b};`;
        applyTheme[
          cssVarNameTheme
        ].hexVars = `${applyTheme[cssVarNameTheme].hexVars}${cssVarName}: ${colors[key].hexColor};`;
        applyTheme[
          cssVarNameTheme
        ].hslVars = `${applyTheme[cssVarNameTheme].hslVars}${cssVarName}: ${colors[key].hslColor};`;
        applyTheme[cssVarNameTheme].tailwind[key] = `rgb(var(${cssVarName}))`;
      }
    } else {
      vars = `${vars}${cssVarName}: ${r}, ${g}, ${b};`;
      hexVars = `${hexVars}${cssVarName}: ${colors[key].hexColor};`;
      hslVars = `${hslVars}${cssVarName}: ${colors[key].hslColor};`;
      tailwind[key] = `rgb(var(${cssVarName}))`;
    }
  });

  if (Object.keys(applyTheme).length) {
    return {
      vars: Object.keys(applyTheme).reduce((acc, theme) => {
        return `${acc}${createThemeRootString(theme, applyTheme[theme].vars, theme === themes[0])}`;
      }, ''),
      hexVars: Object.keys(applyTheme).reduce((acc, theme) => {
        return `${acc}${createThemeRootString(
          theme,
          applyTheme[theme].hexVars,
          theme === themes[0]
        )}`;
      }, ''),
      hslVars: Object.keys(applyTheme).reduce((acc, theme) => {
        return `${acc}${createThemeRootString(
          theme,
          applyTheme[theme].hslVars,
          theme === themes[0]
        )}`;
      }, ''),
      tailwind: Object.keys(applyTheme).reduce((acc, theme) => {
        return { ...acc, [theme]: applyTheme[theme].tailwind };
      }, {})
    };
  }

  return {
    vars: `:root{${vars}}`,
    hexVars: `:root{${hexVars}}`,
    hslVars: `:root{${hslVars}}`,
    tailwind
  };
};

const createFile = (name, payload, outDir, ext = 'json') =>
  fsp.writeFile(
    `${outDir}/${name}.${ext}`,
    JSON.stringify(payload, null, 2).replace(/^"(.+(?="$))"$/, '$1'),
    err => {
      if (err) throw new Error(`\x1b[31m${emojis.error} ${err}\n\n`);
      // eslint-disable-next-line no-console
      console.log(` ${emojis[name]} ${name} tokens created!`);
    }
  );

export {
  camelCase,
  createFile,
  emojis,
  filterArtboards,
  formatNumber,
  fullColorHex,
  fullColorHsl,
  generateCSSVariables,
  generateTokens,
  genShadow,
  getColor,
  rgbaGen,
  rgbaGenObject,
  rgbToHex,
  parseRgba,
  pixelate,
  remify,
  snakeCase,
  trim
};
