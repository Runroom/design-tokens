import { TokenCollection, Tokens } from '@/types/designTokens/tokens.ts';
import { RgbColor } from '@/types/designTokens/color.ts';

export interface ShadowCollection extends TokenCollection {
  shadows: {
    [key: string]: Shadow;
  };
}

export type Shadow = {
  color: RgbColor;
  offset: Offset;
  radius: number;
}[];

export interface ShadowToken extends Tokens {
  [key: string]: Shadow;
}

export type Offset = {
  x: number;
  y: number;
};
