import { SpacingJson } from '@/types/designTokens/spacing.ts';
import { ColorJson } from '@/types/designTokens/color.ts';
import { TypographyJson } from '@/types/designTokens/typography.ts';
import { BreakpointJson } from '@/types/designTokens/breakpoint.ts';
import { DesignTokensGenerator } from '@/classes';
import { FigmaFrame } from '@/types/figma';

export interface Token {
  [key: string]: any;
}

export type GenerateTokens = SpacingJson | ColorJson | TypographyJson | BreakpointJson;

export type DesignTokensPages = {
  name: string;
  class: new (frame: FigmaFrame, themes?: string[]) => DesignTokensGenerator;
};
