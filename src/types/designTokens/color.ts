import { Token, TokenCollection, Tokens } from '@/types/designTokens/tokens.ts';

export interface ColorCollection extends TokenCollection {
  colors: {
    [key: string]: Color;
  };
}

export interface Color extends Token {
  name: string;
  value: string;
  valueRgb: RgbColor;
  valueHsl: HslColor;
}

export interface HslColor {
  h: number;
  s: number;
  l: number;
  a: number;
}

export interface RgbColor {
  r: number;
  g: number;
  b: number;
  a: number;
}

export interface ColorToken extends Tokens {
  [key: string]:
    | Color
    | {
        [key: string]: Color;
      };
}
