import { DesignTokens } from './DesignTokens.ts';
import { CreateFile, SpacingCollection, SpacingToken } from '@/types/designTokens';
import { FigmaFrame, FigmaSpacingComponent } from '@/types/figma';
import { getTokens, pixelate, remify, snakeCase } from '@/functions';

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  writeCssVariables(createFile: CreateFile, outputDir: string, name = 'spacings-vars') {
    // TODO: Implement CSS variables for spacings
    return [Promise.resolve()];
  }

  static getBoundingWidth(component: FigmaSpacingComponent): SpacingToken | false {
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
