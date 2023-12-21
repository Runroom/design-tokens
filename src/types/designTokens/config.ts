import { DesignPages } from '@/designTokensPages.ts';
import { Config as StyleDictionaryConfig } from 'style-dictionary';

export type Config = {
  figmaApiKey: string;
  figmaProjectId: string;
  figmaPages: FigmaPages;
  outputDir: string;
  darkMode?: boolean;
  darkModeStyleDictionary?: StyleDictionaryConfig;
  styleDictionary?: StyleDictionaryConfig;
};

export type FigmaPages = {
  [key: string]: DesignPages[];
};
