const createThemeRootString = (theme: string, vars: string, defaultTheme: boolean) =>
  `:root[data-theme='${theme}']{${vars} ${defaultTheme ? `color-scheme: ${theme};` : ''}}`;

const createRootString = (vars: string) => `:root{${vars}}`;

export { createThemeRootString, createRootString };
