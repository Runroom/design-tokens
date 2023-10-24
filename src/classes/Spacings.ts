import {
  CreateFile,
  DesignTokensGenerator,
  SpacingCollection,
  SpacingToken
} from '@/types/designTokens';
import { FigmaFrame, FigmaSpacingComponent } from '@/types/figma';
import { createRootString, getTokens, pixelate, remify, snakeCase } from '@/functions';

export class Spacings implements DesignTokensGenerator {
  readonly tokens: SpacingCollection;

  constructor(figmaFrame: FigmaFrame) {
    this.tokens = getTokens<FigmaSpacingComponent, SpacingCollection, SpacingToken>(
      'Spacings',
      figmaFrame,
      this.getBoundingWidth
    );
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

  private getBoundingWidth(component: FigmaSpacingComponent): SpacingToken | false {
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
