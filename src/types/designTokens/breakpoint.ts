import { Token } from '@/types/designTokens/token.ts';

export interface BreakpointJson {
  [spacings: string]: {
    [key: string]: Breakpoint;
  };
}

export interface Breakpoint {
  value: string;
  remValue: string;
}

export interface BreakpointToken extends Token {
  [key: string]: Breakpoint;
}
