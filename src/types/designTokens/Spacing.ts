import { Token } from '@/types/designTokens/Token.ts';

export interface SpacingJson {
  [spacings: string]: {
    [key: string]: Spacing;
  };
}

export interface Spacing {
  value: string;
  remValue: string;
}

export interface SpacingToken extends Token {
  [key: string]: Spacing;
}
