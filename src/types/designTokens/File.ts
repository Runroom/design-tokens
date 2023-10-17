import { GenerateTokens } from '@/types/designTokens/Token.ts';

export type CreateFile = (
  name: string,
  payload: GenerateTokens | string,
  outDir: string,
  ext?: string
) => Promise<void>;
