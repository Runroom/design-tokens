import { Token } from '@/types/designTokens/Token.ts';

export interface ColorJson {
  [colors: string]: {
    [key: string]: Color;
  };
}

export interface Color {
  name: string;
  rgbColor: RgbColor;
  hexColor: string;
  hslColor: HslColor;
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

export interface ColorToken extends Token {
  [key: string]: Color;
}
