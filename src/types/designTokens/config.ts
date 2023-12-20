import { DesignPages } from '@/designTokensPages.ts';
import { Config as StyleDictionaryConfig } from 'style-dictionary';

export type Config = {
  figmaApiKey: string;
  figmaProjectId: string;
  figmaPages: FigmaPages;
  outputDir: string;
  figmaThemes?: string[];
} & StyleDictionaryConfig;

export type ParseConfig = {
  settings: Config;
  configFile: string;
};

export type FigmaPages = {
  [key: string]: DesignPages[];
};
