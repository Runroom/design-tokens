import { TokenCollection, Tokens } from '@/types/designTokens/tokens.ts';

export interface BorderCollection extends TokenCollection {
  borders: {
    [key: string]: Border;
  };
}

export interface Border {
  value: string;
}

export interface BorderToken extends Tokens {
  [key: string]: Border;
}
