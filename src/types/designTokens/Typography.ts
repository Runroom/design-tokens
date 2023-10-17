import { Token } from '@/types/designTokens/Token.ts';

export interface TypographyJson {
  [typography: string]: {
    [key: string]: Typography;
  };
}

export interface Typography {
  fontFamily: string;
  fontSize: string;
  fontWeight: number;
  letterSpacing: string | number;
  lineHeight: number;
}

export interface TypographyToken extends Token {
  [key: string]: Typography;
}
