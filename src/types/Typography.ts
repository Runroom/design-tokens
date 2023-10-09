import { Token } from '@/types/Token.ts';

export interface TypographyJson {
  [typography: string]: {
    [key: string]: Typography;
  };
}

export interface Typography {
  fontFamily: string;
  fontSize: string;
  rawFontSize: number;
  fontWeight: number;
  letterSpacing: string | number;
  lineHeight: number;
}

export interface TypographyToken extends Token {
  [key: string]: Typography;
}
