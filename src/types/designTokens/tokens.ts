export interface Tokens {
  [key: string]: unknown;
}

export interface TokenCollection {
  [key: string]: {
    [key: string]: unknown;
  };
}
