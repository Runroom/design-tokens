import { CreateFile } from '@/types/designTokens/file.ts';

export interface DesignTokensGenerator {
  writeTokens(createFile: CreateFile, outputDir: string, name?: string): Promise<void>[];
  writeCssVariables(createFile: CreateFile, outputDir: string, name?: string): Promise<void>[];
}
