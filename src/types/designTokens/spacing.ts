import { Token, TokenCollection, Tokens } from '@/types/designTokens/tokens.ts';

export interface SpacingCollection extends TokenCollection {
  spacings: {
    [key: string]: Spacing;
  };
}

export interface Spacing extends Token {
  value: string;
}

export interface SpacingToken extends Tokens {
  [key: string]: Spacing;
}
