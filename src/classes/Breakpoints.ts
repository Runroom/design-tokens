import {
  BreakpointCollection,
  BreakpointToken,
  CreateFile,
  DesignTokensGenerator,
  TokenPayload
} from '@/types/designTokens';
import { FigmaBreakPointComponent } from '@/types/figma';
import { createRootString, getTokens, pixelate, remify, snakeCase } from '@/functions';

const generateCssBreakpointVariables = ({ breakpoints }: BreakpointCollection) => {
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
};

const getBoundingWidth = (component: FigmaBreakPointComponent): BreakpointToken | false => {
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
};

const writeBreakpointTokens =
  (tokens: BreakpointCollection) =>
  (createFile: CreateFile, outputDir: string, name = 'breakpoints') => {
    return [createFile(name, tokens, outputDir, 'json')];
  };

const writeBreakPointVariables =
  (tokens: BreakpointCollection) =>
  (createFile: CreateFile, outputDir: string, name = 'breakpoints-vars') => {
    const { breakpointsVars } = generateCssBreakpointVariables(tokens);
    return [createFile(name, breakpointsVars, outputDir, 'css')];
  };

const Breakpoints = ({ frame }: TokenPayload): DesignTokensGenerator => {
  const tokens = getTokens<FigmaBreakPointComponent, BreakpointCollection, BreakpointToken>(
    'Breakpoints',
    frame,
    getBoundingWidth
  );

  return {
    name: 'Breakpoints',
    tokens,
    writeTokens: writeBreakpointTokens(tokens),
    writeCssVariables: writeBreakPointVariables(tokens)
  };
};

export { Breakpoints };
