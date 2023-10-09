import { SpacingJson } from '@/types/Spacing.ts';
import { ColorJson } from '@/types/Color.ts';
import { TypographyJson } from '@/types/Typography.ts';

export interface Token {
  [key: string]: any;
}

export type GenerateTokens = SpacingJson | ColorJson | TypographyJson;
