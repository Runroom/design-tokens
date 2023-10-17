import { DesignTokens } from './DesignTokens.ts';
import { CreateFile, Typography, TypographyJson, TypographyToken } from '@/types/designTokens';
import { FigmaFrame, FigmaTypographyComponent } from '@/types/figma';
import { camelCase, createRootString, getTokens, kebabCase, remify } from '@/functions';

export class Typographies extends DesignTokens<TypographyJson> {
  constructor(figmaFrame: FigmaFrame) {
    const tokens = getTokens<FigmaTypographyComponent, TypographyJson, TypographyToken>(
      'Typography',
      figmaFrame,
      Typographies.getTypography
    );

    super(tokens);
  }

  writeTokens(createFile: CreateFile, outputDir: string, name = 'typographies') {
    return [createFile(name, this.tokens, outputDir, 'json')];
  }

  writeCssVariables(createFile: CreateFile, outputDir: string, name = 'typographies-vars') {
    const { typographyVars } = this.generateCssTypographyVariables(this.tokens);
    return [createFile(name, typographyVars, outputDir, 'css')];
  }

  private generateCssTypographyVariables({ typography }: TypographyJson) {
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
      typographyVars: createRootString(typographyVars)
    };
  }

  static getTypography(component: FigmaTypographyComponent): TypographyToken | false {
    if (!(component && component.name && component.children && component.children.length)) {
      return false;
    }

    const token = component.children[0];

    if (!token.style) {
      return false;
    }

    const { fontFamily, fontSize, letterSpacing, lineHeightPercentFontSize, fontWeight } =
      token.style;
    const lineHeight = Math.floor(lineHeightPercentFontSize) / 100;
    const letterSpacingRounded = Math.floor(letterSpacing);

    return {
      [camelCase(component.name)]: {
        fontFamily,
        fontSize: remify(fontSize),
        fontWeight,
        letterSpacing: letterSpacingRounded < 1 ? 0 : `${letterSpacingRounded}px`,
        lineHeight
      }
    };
  }
}
