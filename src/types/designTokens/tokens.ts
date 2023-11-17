import { FigmaFrame } from '@/types/figma';

export interface Tokens {
  [key: string]: unknown;
}

export interface TokenCollection {
  [key: string]: {
    [key: string]: unknown;
  };
}

export type TokenPayload = {
  frame: FigmaFrame;
  themes?: string[];
};
