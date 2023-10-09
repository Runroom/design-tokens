export type Config = {
  FIGMA_APIKEY: string;
  FIGMA_ID: string;
  FIGMA_PAGE_NAME: string;
  TOKENS_DIR: string;
  pages: string[];
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
