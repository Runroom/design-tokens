export type Theme = {
  vars: string;
  hexVars: string;
  hslVars: string;
};

export type ApplyTheme = {
  [key: string]: Theme;
};
