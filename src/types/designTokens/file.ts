import { TokenCollection } from '@/types/designTokens/tokens.ts';

export type CreateFile = (
  name: string,
  payload: TokenCollection | string,
  outDir: string,
  ext?: string
) => Promise<void>;
