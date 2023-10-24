import { FigmaFrame } from '@/types/figma';
import { CreateFile } from '@/types/designTokens/file.ts';

export interface DesignTokensGenerator {
  writeTokens(createFile: CreateFile, outputDir: string, name?: string): Promise<void>[];
  writeCssVariables(createFile: CreateFile, outputDir: string, name?: string): Promise<void>[];
}

export type DesignTokensPages = {
  name: string;
  class: new (frame: FigmaFrame, themes?: string[]) => DesignTokensGenerator;
};
