import { TokenCollection, Tokens } from '@/types/designTokens/tokens.ts';

export interface BreakpointCollection extends TokenCollection {
  breakpoints: {
    [key: string]: Breakpoint;
  };
}

export interface Breakpoint {
  value: string;
  remValue: string;
}

export interface BreakpointToken extends Tokens {
  [key: string]: Breakpoint;
}
