import { SpacingJson } from '@/types/designTokens/Spacing.ts';
import { ColorJson } from '@/types/designTokens/Color.ts';
import { TypographyJson } from '@/types/designTokens/Typography.ts';
import { BreakpointJson } from '@/types/designTokens/Breakpoint.ts';

export interface Token {
  [key: string]: any;
}

export type GenerateTokens = SpacingJson | ColorJson | TypographyJson | BreakpointJson;
