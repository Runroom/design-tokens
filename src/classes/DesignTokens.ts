import { CreateFile, DesignTokensGenerator, TokenCollection } from '@/types/designTokens';

export abstract class DesignTokens<T extends TokenCollection> implements DesignTokensGenerator {
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
