import {
  BreakpointCollection,
  BreakpointToken,
  CreateFile,
  DesignTokensGenerator
} from '@/types/designTokens';
import { FigmaBreakPointComponent, FigmaFrame } from '@/types/figma';
import { getTokens, pixelate, remify, snakeCase } from '@/functions';

export class Breakpoints implements DesignTokensGenerator {
  readonly tokens: BreakpointCollection;

  constructor(figmaFrame: FigmaFrame) {
    this.tokens = getTokens<FigmaBreakPointComponent, BreakpointCollection, BreakpointToken>(
      'Breakpoints',
      figmaFrame,
      this.getBoundingWidth
    );
  }

  writeTokens(createFile: CreateFile, outputDir: string, name = 'breakpoints') {
    return [createFile(name, this.tokens, outputDir, 'json')];
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  writeCssVariables(createFile: CreateFile, outputDir: string, name = 'breakpoints-vars') {
    // TODO: Implement CSS variables for breakpoints
    return [Promise.resolve()];
  }

  private getBoundingWidth(component: FigmaBreakPointComponent): BreakpointToken | false {
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
