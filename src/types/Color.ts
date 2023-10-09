import { Token } from '@/types/Token.ts';

export interface ColorJson {
  [colors: string]: {
    [key: string]: Color;
  };
}

export interface Color {
  name: string;
  rgbColor: RgbColor;
  hexColor: string;
  hslColor: number[] | undefined;
}
export interface RgbColor {
  r: number;
  g: number;
  b: number;
  a: number;
}

export interface TailwindColors {
  [key: string]: string;
}

export interface ColorToken extends Token {
  [key: string]: Color;
}
