import { ColorJson } from '@/types/Color.ts';
import { Typography, TypographyJson } from '@/types/Typography.ts';
import { kebabCase } from './stringManipulation.ts';

type Theme = {
  vars: string;
  hexVars: string;
  hslVars: string;
};

type ApplyTheme = {
  [key: string]: Theme;
};

const createThemeRootString = (theme: string, vars: string, defaultTheme: boolean) =>
  `:root[data-theme='${theme}']{${vars} ${defaultTheme ? `color-scheme: ${theme};` : ''}}`;

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
      vars = `${vars}${cssVarName}: rgb(${r} ${g} ${b} / ${rgbAlpha});`;
      hexVars = `${hexVars}${cssVarName}: ${colors[key].hexColor};`;
      hslVars = `${hslVars}${cssVarName}: hsl(${h} ${s}% ${l}% / ${hslAlpha});`;
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

export { generateCSSVariables, generateTypographyCSS, createThemeRootString };
