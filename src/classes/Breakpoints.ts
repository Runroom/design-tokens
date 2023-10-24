import {
  BreakpointCollection,
  BreakpointToken,
  CreateFile,
  DesignTokensGenerator
} from '@/types/designTokens';
import { FigmaBreakPointComponent, FigmaFrame } from '@/types/figma';
import { createRootString, getTokens, pixelate, remify, snakeCase } from '@/functions';

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

  writeCssVariables(createFile: CreateFile, outputDir: string, name = 'breakpoints-vars') {
    const { breakpointsVars } = this.generateCssBreakpointVariables(this.tokens);
    return [createFile(name, breakpointsVars, outputDir, 'css')];
  }

  private generateCssBreakpointVariables({ breakpoints }: BreakpointCollection) {
    let breakpointsVars = '';
    const breakpointsBaseName = 'breakpoint';

    for (const key in breakpoints) {
      const breakpointVarsName = `--${breakpointsBaseName}-${key}`;
      const breakpointRemValue = `${breakpointVarsName}: ${breakpoints[key].remValue}`;
      breakpointsVars = `${breakpointsVars}${breakpointRemValue};`;
    }

    return {
      breakpointsVars: createRootString(breakpointsVars)
    };
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
