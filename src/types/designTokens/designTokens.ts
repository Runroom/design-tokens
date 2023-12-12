import { CreateFile } from '@/types/designTokens/file.ts';
import { TokenCollection } from '@/types/designTokens/tokens.ts';

export interface DesignTokensGenerator {
  name: string;
  tokens: TokenCollection;

  writeTokens(createFile: CreateFile, outputDir: string, name?: string): Promise<void>[];
}
