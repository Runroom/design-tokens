import {
  CreateFile,
  DesignTokensGenerator,
  Typography,
  TypographyCollection,
  TypographyToken
} from '@/types/designTokens';
import { FigmaFrame, FigmaTypographyComponent } from '@/types/figma';
import { camelCase, createRootString, getTokens, kebabCase, remify } from '@/functions';

export class Typographies implements DesignTokensGenerator {
  readonly tokens: TypographyCollection;

  constructor(figmaFrame: FigmaFrame) {
    this.tokens = getTokens<FigmaTypographyComponent, TypographyCollection, TypographyToken>(
      'Typography',
      figmaFrame,
      this.getTypography
    );
  }

  writeTokens(createFile: CreateFile, outputDir: string, name = 'typographies') {
    return [createFile(name, this.tokens, outputDir, 'json')];
  }

  writeCssVariables(createFile: CreateFile, outputDir: string, name = 'typographies-vars') {
    const { typographyVars } = this.generateCssTypographyVariables(this.tokens);
    return [createFile(name, typographyVars, outputDir, 'css')];
  }

  private generateCssTypographyVariables({ typography }: TypographyCollection) {
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

  private getTypography(component: FigmaTypographyComponent): TypographyToken | false {
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