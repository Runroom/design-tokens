import { CreateFile, GenerateTokens } from '@/types/designTokens';

export interface DesignTokensGenerator {
  writeTokens(createFile: CreateFile, outputDir: string, name?: string): Promise<void>[];
  writeCssVariables(createFile: CreateFile, outputDir: string, name?: string): Promise<void>[];
}

export abstract class DesignTokens<T extends GenerateTokens> implements DesignTokensGenerator {
  readonly tokens: T;
  readonly themes?: string[];

  protected constructor(tokens: T, themes?: string[]) {
    this.tokens = tokens;
    this.themes = themes;
  }

  abstract writeTokens(createFile: CreateFile, outputDir: string, name?: string): Promise<void>[];
  abstract writeCssVariables(
    createFile: CreateFile,
    outputDir: string,
    name?: string
  ): Promise<void>[];
}
