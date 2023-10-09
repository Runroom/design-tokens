import { promises as fsp } from 'fs';
import { FigmaComponent, FigmaFrame } from '@/types/figma';
import { ColorJson, RgbColor, TailwindColors } from '@/types/Color.ts';
import { GenerateTokens, Token } from '@/types/Token.ts';

type Offset = {
  x: number;
  y: number;
};

const EMOJIS = {
  color: '🎨',
  typography: '🖋 ',
  spacing: '📐',
  breakpoint: '🍪',
  success: '✅',
  error: '❌',
  warning: '⚠️'
};

const camelCase = (string: string) => {
  const stringUpdate = string
    .toLowerCase()
    .replace(/(?:(^.)|([-_\s]+.))/g, match => match.charAt(match.length - 1).toUpperCase());
  return stringUpdate.charAt(0).toLowerCase() + stringUpdate.substring(1);
};

const snakeCase = (string: string) => {
  const matches = string.match(
    /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g
  );

  if (!matches) {
    return string;
  }

  return matches.map((ch: string) => ch.toLowerCase()).join('_');
};

const formatNumber = (n: string | number) => parseFloat(parseFloat(String(n)).toFixed(5));

const trim = (string: string) => string.replace(/^\s+|\s+$/gm, '');

const getColor = (color: number) => Math.round(color * 255);

const rgbaGen = (r: number, g: number, b: number, a = 1) =>
  `rgba(${getColor(r)}, ${getColor(g)}, ${getColor(b)}, ${a})`;

const rgbaGenObject = (r: number, g: number, b: number, a = 1) => ({
  r: getColor(r),
  g: getColor(g),
  b: getColor(b),
  a
});

const rgbToHex = (c: number) => {
  const hex = Number(c).toString(16);
  return hex.length < 2 ? `0${hex}` : hex;
};

const fullColorHex = (r: number, g: number, b: number) => {
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

const fullColorHsl = (r: number, g: number, b: number) => {
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;

  const max = Math.max(red, green, blue),
    min = Math.min(red, green, blue);
  let h, s;
  const l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
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

    if (!h) {
      return;
    }

    h /= 6;
  }

  return [h, s, l];
};

const parseRgba = (color: RgbColor) => {
  const { r, g, b, a } = color;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

const genShadow = (color: RgbColor, offset: Offset, radius: number) => {
  const { x, y } = offset;
  return `${x}px ${y}px ${radius}px ${parseRgba(color)}`;
};

const pixelate = (value: number) => `${Math.floor(value)}px`;

const remify = (value: number) => `${formatNumber(value / 16)}rem`;

const filterArtBoards = <T extends FigmaComponent>(
  artBoardName: string,
  stylesArtBoard: FigmaFrame[]
): T[] => {
  const artBoard = stylesArtBoard.filter(item => item.name === artBoardName)[0];

  if (!artBoard.children) {
    return [];
  }

  const components = artBoard.children as T[];

  return components.filter(item => item.type === 'COMPONENT');
};

const initPayload = <P extends GenerateTokens>(componentsIndex: string): P => {
  const payload: P = {} as P;
  Object.assign(payload, { [componentsIndex]: {} });
  return payload;
};

const generateTokens = <T extends FigmaComponent, P extends GenerateTokens, K extends Token>(
  artBoardName: string,
  stylesArtBoard: FigmaFrame[],
  decorator: (component: T) => K | false
): P => {
  const components = filterArtBoards<T>(artBoardName, stylesArtBoard);
  const componentsIndex = snakeCase(artBoardName);
  const payload = initPayload<P>(componentsIndex);

  components.map(component => {
    const data = decorator(component);

    if (data) {
      Object.assign(payload[componentsIndex], data);
    }
  });

  return payload;
};

const createThemeRootString = (theme: string, vars: string, defaultTheme: boolean) =>
  `:root[data-theme='${theme}']{${vars} ${defaultTheme ? `color-scheme: ${theme};` : ''}}`;

type Theme = {
  vars: string;
  hexVars: string;
  hslVars: string;
  tailwind: TailwindColors;
};

type ApplyTheme = {
  [key: string]: Theme;
};

const generateCSSVariables = ({ colors }: ColorJson, themes: string[] = []) => {
  const tailwind: TailwindColors = {};
  let vars = '';
  let hexVars = '';
  let hslVars = '';

  const applyTheme =
    themes && themes.length
      ? themes.reduce((acc: ApplyTheme, theme: string) => {
          return {
            ...acc,
            [theme]: {
              vars: '',
              hexVars: '',
              hslVars: '',
              tailwind: {} as TailwindColors
            }
          };
        }, {})
      : {};

  Object.keys(colors).map(key => {
    const { r, g, b } = colors[key].rgbColor;
    let cssVarName = `--${colors[key].name}`;

    if (Object.keys(applyTheme).length) {
      const cssVarNameTheme = cssVarName.split('-')[2];
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

const createFile = (name: string, payload: GenerateTokens | string, outDir: string, ext = 'json') =>
  fsp.writeFile(
    `${outDir}/${name}.${ext}`,
    JSON.stringify(payload, null, 2).replace(/^"(.+(?="$))"$/, '$1')
  );

export {
  camelCase,
  createFile,
  EMOJIS,
  filterArtBoards,
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
