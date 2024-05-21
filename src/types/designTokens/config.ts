import { DesignPages } from '@/designTokensPages.ts';
import { Config as StyleDictionaryConfig } from 'style-dictionary';

export type Config = {
  figmaApiKey: string;
  figmaProjectId: string;
  figmaPages: FigmaPages;
  outputDir: string;
  figmaThemes?: string[];
  experimentalColorName?: boolean;
  styleDictionary?: StyleDictionaryConfig;
};

export type FigmaPages = {
  [key: string]: DesignPages[];
};
