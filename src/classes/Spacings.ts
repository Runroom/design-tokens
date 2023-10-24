import {
  CreateFile,
  DesignTokensGenerator,
  SpacingCollection,
  SpacingToken
} from '@/types/designTokens';
import { FigmaFrame, FigmaSpacingComponent } from '@/types/figma';
import { getTokens, pixelate, remify, snakeCase } from '@/functions';

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  writeCssVariables(createFile: CreateFile, outputDir: string, name = 'spacings-vars') {
    // TODO: Implement CSS variables for spacings
    return [Promise.resolve()];
  }

  private getBoundingWidth(component: FigmaSpacingComponent): SpacingToken | false {
    if (!(component && component.name)) {
      return false;
    }

    const name = snakeCase(component.name);
    const value = pixelate(component.absoluteBoundingBox.width);
    const remValue = remify(component.absoluteBoundingBox.width);

    return {
      [name]: {
        value,
        remValue
      }
    };
  }
}
