import { FigmaFrame } from '@/types/figma';

export interface Tokens {
  [key: string]: object;
}

export interface TokenCollection {
  [key: string]: {
    [key: string]: object;
  };
}

export type TokenPayload = {
  frame: FigmaFrame;
  darkMode?: boolean;
};
