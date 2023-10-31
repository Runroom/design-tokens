import { TokenCollection, Tokens } from '@/types/designTokens/tokens.ts';
import { RgbColor } from '@/types/designTokens/color.ts';

export type GradientType = 'linear' | 'radial';
export type GradientCSSType = 'linear-gradient' | 'radial-gradient';
export type GradientTypes = {
  [key in GradientType]: GradientCSSType;
};

export interface GradientCollection extends TokenCollection {
  gradients: {
    [key: string]: Gradient;
  };
}

export interface Gradient {
  type: GradientCSSType;
  deg: 'circle' | `${string}deg`;
  colors: GradientColor[];
}

export type GradientColor = {
  color: RgbColor;
  position: number;
};

export interface GradientToken extends Tokens {
  [key: string]: Gradient;
}
