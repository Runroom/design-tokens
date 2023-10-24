import { createRootString, getTokens, remify, snakeCase } from '@/functions';
import {
  BorderCollection,
  BorderToken,
  CreateFile,
  DesignTokensGenerator
} from '@/types/designTokens';
import { FigmaBorderComponent, FigmaFrame } from '@/types/figma';

export class Borders implements DesignTokensGenerator {
  readonly tokens: BorderCollection;

  constructor(figmaFrame: FigmaFrame) {
    this.tokens = getTokens<FigmaBorderComponent, BorderCollection, BorderToken>(
      'Borders',
      figmaFrame,
      this.getBoundingWidth
    );
  }

  writeTokens(createFile: CreateFile, outputDir: string, name = 'borders') {
    return [createFile(name, this.tokens, outputDir, 'json')];
  }

  writeCssVariables(createFile: CreateFile, outputDir: string, name = 'borders-vars') {
    const { bordersVars } = this.generateCssBordersVariables(this.tokens);
    return [createFile(name, bordersVars, outputDir, 'css')];
  }

  private generateCssBordersVariables({ borders }: BorderCollection) {
    let bordersVars = '';
    const borderBaseName = '--border-radius';

    for (const key in borders) {
      const borderName = `${borderBaseName}-${key}`;
      const borderValue = borders[key].value;
      bordersVars = `${bordersVars}${borderName}: ${borderValue};`;
    }

    return {
      bordersVars: createRootString(bordersVars)
    };
  }

  private getBoundingWidth(component: FigmaBorderComponent): BorderToken | false {
    if (!(component && component.name)) {
      return false;
    }

    const corner = component.cornerRadius
      ? component.cornerRadius
      : component.children
      ? component.children[0].cornerRadius
      : 0;

    const name = snakeCase(component.name);
    const value = remify(corner);

    return {
      [name]: {
        value
      }
    };
  }
}
