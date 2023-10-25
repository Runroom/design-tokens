import { TokenCollection, Tokens } from '@/types/designTokens/tokens.ts';

export interface SpacingCollection extends TokenCollection {
  spacings: {
    [key: string]: Spacing;
  };
}

export interface Spacing {
  value: string;
  remValue: string;
}

export interface SpacingToken extends Tokens {
  [key: string]: Spacing;
}
