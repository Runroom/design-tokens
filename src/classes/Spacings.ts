import { DesignTokens } from './DesignTokens.ts';
import { CreateFile, SpacingCollection, SpacingToken } from '@/types/designTokens';
import { FigmaFrame, FigmaSpacingComponent } from '@/types/figma';
import { createRootString, getTokens, pixelate, remify, snakeCase } from '@/functions';

export class Spacings extends DesignTokens<SpacingCollection> {
  constructor(figmaFrame: FigmaFrame) {
    const tokens = getTokens<FigmaSpacingComponent, SpacingCollection, SpacingToken>(
      'Spacings',
      figmaFrame,
      Spacings.getBoundingWidth
    );

    super(tokens);
  }

  writeTokens(createFile: CreateFile, outputDir: string, name = 'spacings') {
    return [createFile(name, this.tokens, outputDir, 'json')];
  }

  writeCssVariables(createFile: CreateFile, outputDir: string, name = 'spacings-vars') {
    const { spacingsVars } = this.generateCssSpacingVariables(this.tokens);
    return [createFile(name, spacingsVars, outputDir, 'css')];
  }

  private generateCssSpacingVariables({ spacings }: SpacingCollection) {
    let spacingsVars = '';
    const spacingBaseName = 'spacing';

    for (const key in spacings) {
      const spacingVarsName = `--${spacingBaseName}-${key}`;
      const spacingRemValue = `${spacingVarsName}: ${spacings[key].remValue}`;
      spacingsVars = `${spacingsVars}${spacingRemValue};`;
    }

    return {
      spacingsVars: createRootString(spacingsVars)
    };
  }

  static getBoundingWidth(component: FigmaSpacingComponent): SpacingToken | false {
    if (!(component && component.name)) {
      return false;
    }

    const name = snakeCase(component.name);
    const value = pixelate(component.absoluteBoundingBox.height);
    const remValue = remify(component.absoluteBoundingBox.height);

    return {
      [name]: {
        value,
        remValue
      }
    };
  }
}
