import { DesignPages } from '@/designTokensPages.ts';

export type Config = {
  figmaApiKey: string;
  figmaProjectId: string;
  figmaPages: FigmaPages;
  outputDir: string;
  figmaThemes?: string[];
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
