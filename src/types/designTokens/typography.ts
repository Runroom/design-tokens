import { Token, TokenCollection, Tokens } from '@/types/designTokens/tokens.ts';

export interface TypographyCollection extends TokenCollection {
  typography: {
    [key: string]: Typography;
  };
}

export interface Typography extends Token {
  value: {
    fontFamily: string;
    fontSize: string;
    fontWeight: number;
    letterSpacing: string | number;
    lineHeight: number;
  };
}

export interface TypographyToken extends Tokens {
  [key: string]: Typography;
}
