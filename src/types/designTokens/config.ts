import { DesignPages } from '@/designTokensPages.ts';

export type Config = {
  FIGMA_APIKEY: string;
  FIGMA_ID: string;
  FIGMA_PAGES: FigmaPages;
  TOKENS_DIR: string;
  themes?: string[];
  source?: string[];
  platforms?: {
    [key: string]: [
      {
        transformGroup: string;
        buildPath: string;
        files: {
          destination: string;
          format: string;
        };
      }
    ];
  };
};

export type ParseConfig = {
  settings: Config;
  configFile: string;
};

export type FigmaPages = {
  [key: string]: DesignPages[];
};
