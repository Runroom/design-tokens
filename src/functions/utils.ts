import { promises as fsp } from 'fs';
import { FigmaComponent, FigmaFrame } from '@/types/figma';
import { ColorJson, HslColor, RgbColor } from '@/types/Color.ts';
import { GenerateTokens, Token } from '@/types/Token.ts';
import { Typography, TypographyJson } from '@/types/Typography.ts';

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

const HEX_BASE = 16;
const REM_BASE = 16;

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

const kebabCase = (input: string): string => {
  return input
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[_\s]+/g, '-')
    .toLowerCase();
};

const formatNumber = (n: string | number) => parseFloat(parseFloat(String(n)).toFixed(5));

const trim = (string: string) => string.replace(/^\s+|\s+$/gm, '');

const getColor = (color: number) => Math.round(color * 255);

const rgbaGen = (r: number, g: number, b: number, a = 1) =>
  `rgb(${getColor(r)} ${getColor(g)} ${getColor(b)} / ${a})`;

const rgbaGenObject = (r: number, g: number, b: number, a = 1) => ({
  r: getColor(r),
  g: getColor(g),
  b: getColor(b),
  a: a
});

const rgbToHex = (c: number) => {
  const hex = Number(c).toString(HEX_BASE);
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

const fullColorHsl = (r: number, g: number, b: number, a = 1): HslColor => {
  const red = Math.min(255, Math.max(0, r));
  const green = Math.min(255, Math.max(0, g));
  const blue = Math.min(255, Math.max(0, b));
  const alpha = Math.min(100, Math.max(0, a));

  const redNormalized = red / 255;
  const greenNormalized = green / 255;
  const blueNormalized = blue / 255;

  const max = Math.max(redNormalized, greenNormalized, blueNormalized);
  const min = Math.min(redNormalized, greenNormalized, blueNormalized);

  const lightness = (max + min) / 2;

  let hue = 0;
  let saturation = 0;

  if (max !== min) {
    const delta = max - min;

    saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);

    switch (max) {
      case redNormalized:
        hue =
          ((greenNormalized - blueNormalized) / delta +
            (greenNormalized < blueNormalized ? 6 : 0)) *
          60;
        break;
      case greenNormalized:
        hue = ((blueNormalized - redNormalized) / delta + 2) * 60;
        break;
      case blueNormalized:
        hue = ((redNormalized - greenNormalized) / delta + 4) * 60;
        break;
    }
  }

  return {
    h: Math.round(hue),
    s: Math.round(saturation * 100),
    l: Math.round(lightness * 100),
    a: alpha
  };
};

const parseRgba = (color: RgbColor) => {
  const { r, g, b, a = 1 } = color;
  return `rgb(${r} ${g} ${b} / ${a})`;
};

const genShadow = (color: RgbColor, offset: Offset, radius: number) => {
  const { x, y } = offset;
  return `${x}px ${y}px ${radius}px ${parseRgba(color)}`;
};

const pixelate = (value: number) => `${Math.floor(value)}px`;

const remify = (value: number) => `${formatNumber(value / REM_BASE)}rem`;

const filterArtBoards = <T extends FigmaComponent>(
  artBoardName: string,
  stylesArtBoard: FigmaFrame[]
): T[] => {
  const artBoard = stylesArtBoard.filter(item => item.name === artBoardName)[0];

  if (!artBoard || !artBoard.children) {
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
};

type ApplyTheme = {
  [key: string]: Theme;
};

const generateCSSVariables = ({ colors }: ColorJson, themes: string[] = []) => {
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
              hslVars: ''
            }
          };
        }, {})
      : {};

  Object.keys(colors).map(key => {
    const { r, g, b, a: rgbAlpha } = colors[key].rgbColor;
    const { h, s, l, a: hslAlpha } = colors[key].hslColor;
    let cssVarName = `--${colors[key].name}`;

    if (Object.keys(applyTheme).length) {
      const cssVarNameTheme = cssVarName.split('-')[2];
      if (themes.includes(cssVarNameTheme)) {
        cssVarName = cssVarName.replace(`${cssVarNameTheme}-`, '');

        applyTheme[
          cssVarNameTheme
        ].vars = `${applyTheme[cssVarNameTheme].vars}${cssVarName}: rgb(${r} ${g} ${b} / ${rgbAlpha});`;
        applyTheme[
          cssVarNameTheme
        ].hexVars = `${applyTheme[cssVarNameTheme].hexVars}${cssVarName}: ${colors[key].hexColor};`;
        applyTheme[
          cssVarNameTheme
        ].hslVars = `${applyTheme[cssVarNameTheme].hslVars}${cssVarName}: hsl(${h} ${s}% ${l}% / ${hslAlpha});`;
      }
    } else {
      vars = `${vars}${cssVarName}: ${r}, ${g}, ${b};`;
      hexVars = `${hexVars}${cssVarName}: ${colors[key].hexColor};`;
      hslVars = `${hslVars}${cssVarName}: ${colors[key].hslColor};`;
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
      }, '')
    };
  }

  return {
    vars: `:root{${vars}}`,
    hexVars: `:root{${hexVars}}`,
    hslVars: `:root{${hslVars}}`
  };
};

const generateTypographyCSS = ({ typography }: TypographyJson) => {
  let typographyVars = '';

  for (const key in typography) {
    const typographyBaseName = `--${kebabCase(key)}`;
    const typographyBaseValue = typography[key];

    for (const prop in typography[key]) {
      const propName = `${typographyBaseName}-${kebabCase(prop)}`;
      const typographyValue = typographyBaseValue[prop as keyof Typography];
      typographyVars = `${typographyVars}${propName}: ${typographyValue};`;
    }
  }

  return {
    typographyVars: `:root{${typographyVars}}`
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
  generateTypographyCSS,
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
  kebabCase,
  trim
};
