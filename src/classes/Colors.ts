import { DesignTokens } from './DesignTokens.ts';
import { ApplyTheme, ColorJson, ColorToken, CreateFile } from '@/types/designTokens';
import { FigmaColorComponent, FigmaFrame } from '@/types/figma';
import {
  camelCase,
  createRootString,
  createThemeRootString,
  fullColorHex,
  fullColorHsl,
  getTokens,
  rgbaGenObject
} from '@/functions';

export class Colors extends DesignTokens<ColorJson> {
  constructor(figmaFrame: FigmaFrame, themes?: string[]) {
    const tokens = getTokens<FigmaColorComponent, ColorJson, ColorToken>(
      'Colors',
      figmaFrame,
      Colors.getColors
    );

    super(tokens, themes);
  }

  writeTokens(createFile: CreateFile, outputDir: string, name = 'colors') {
    return [createFile(name, this.tokens, outputDir, 'json')];
  }

  writeCssVariables(createFile: CreateFile, outputDir: string) {
    const promises: Promise<void>[] = [];
    const { hexVars, vars, hslVars } = this.generateCssColorVariables(this.tokens, this.themes);

    promises.push(createFile('rgb-color-vars', vars, outputDir, 'css'));
    promises.push(createFile('hex-color-vars', hexVars, outputDir, 'css'));
    promises.push(createFile('hsl-color-vars', hslVars, outputDir, 'css'));
    return promises;
  }

  private generateCssColorVariables({ colors }: ColorJson, themes: string[] = []) {
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
          return `${acc}${createThemeRootString(
            theme,
            applyTheme[theme].vars,
            theme === themes[0]
          )}`;
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
      vars: createRootString(vars),
      hexVars: createRootString(hexVars),
      hslVars: createRootString(hslVars)
    };
  }

  static getColors(component: FigmaColorComponent): ColorToken | false {
    if (
      !(
        component &&
        component.name &&
        component.children &&
        component.children.length &&
        component.children[0].fills &&
        component.children[0].fills.length
      )
    ) {
      return false;
    }

    const { r, g, b, a } = component.children[0].fills[0].color;
    const name = camelCase(component.name);
    const rgbColor = rgbaGenObject(r, g, b, a);
    const hexColor = fullColorHex(rgbColor.r, rgbColor.g, rgbColor.b);
    const hslColor = fullColorHsl(rgbColor.r, rgbColor.g, rgbColor.b, rgbColor.a);

    return {
      [name]: {
        name: component.name,
        rgbColor,
        hexColor,
        hslColor
      }
    };
  }
}
