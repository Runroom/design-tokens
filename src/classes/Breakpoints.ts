import { BreakpointJson, BreakpointToken, CreateFile } from '@/types/designTokens';
import { FigmaBreakPointComponent, FigmaFrame } from '@/types/figma';
import { DesignTokens } from './DesignTokens.ts';
import { getTokens, pixelate, remify, snakeCase } from '@/functions';

export class Breakpoints extends DesignTokens<BreakpointJson> {
  constructor(figmaFrame: FigmaFrame) {
    const tokens = getTokens<FigmaBreakPointComponent, BreakpointJson, BreakpointToken>(
      'Breakpoints',
      figmaFrame,
      Breakpoints.getBoundingWidth
    );

    super(tokens);
  }

  writeTokens(createFile: CreateFile, outputDir: string, name = 'breakpoints') {
    return [createFile(name, this.tokens, outputDir, 'json')];
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  writeCssVariables(createFile: CreateFile, outputDir: string, name = 'breakpoints-vars') {
    // TODO: Implement CSS variables for breakpoints
    return [Promise.resolve()];
  }

  static getBoundingWidth(component: FigmaBreakPointComponent): BreakpointToken | false {
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
