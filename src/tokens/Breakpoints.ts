import {
  BreakpointCollection,
  BreakpointToken,
  CreateFile,
  DesignTokensGenerator,
  TokenPayload
} from '@/types/designTokens';
import { FigmaBreakPointComponent } from '@/types/figma';
import { getTokens, pixelate, snakeCase } from '@/functions';

const getBoundingWidth = (component: FigmaBreakPointComponent): BreakpointToken | false => {
  if (!(component && component.name)) {
    return false;
  }

  const name = snakeCase(component.name);
  const value = pixelate(component.absoluteBoundingBox.width);

  return {
    [name]: {
      value
    }
  };
};

const writeBreakpointTokens =
  (tokens: BreakpointCollection) =>
  (createFile: CreateFile, outputDir: string, name = 'breakpoints') => {
    return [createFile(name, tokens, outputDir, 'json')];
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
    writeTokens: writeBreakpointTokens(tokens)
  };
};

export { Breakpoints };
