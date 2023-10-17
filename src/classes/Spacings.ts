import { getTokens } from '@/functions/getTokens.ts';
import { FigmaFrame, FigmaSpacingComponent } from '@/types/figma';
import { DesignTokens } from '@/classes/DesignTokens.ts';
import { snakeCase } from '@/functions/stringManipulation.ts';
import { pixelate, remify } from '@/functions/unitsConvert.ts';
import { CreateFile, SpacingJson, SpacingToken } from '@/types/designTokens';

export class Spacings extends DesignTokens<SpacingJson> {
  constructor(figmaFrame: FigmaFrame) {
    const tokens = getTokens<FigmaSpacingComponent, SpacingJson, SpacingToken>(
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
