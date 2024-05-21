import StyleDictionary, {
  Config as StyleDictionaryConfig,
  TransformedToken
} from 'style-dictionary';
import { EMOJIS, log } from '@/functions';
import {
  getColorsParser,
  getGradientsParser,
  getShadowsParser,
  getTypographiesParser
} from '@/tokens';
import { Config } from '@/types/designTokens';

const registerParsers = () => {
  StyleDictionary.registerParser(getTypographiesParser());
  StyleDictionary.registerParser(getShadowsParser());
  StyleDictionary.registerParser(getGradientsParser());
};

const registerColorsParser = () => StyleDictionary.registerParser(getColorsParser());

const buildStyles = (styleDictionary: StyleDictionaryConfig) => {
  const extendedDictionary = StyleDictionary.extend(styleDictionary);

  log('Compiling styles...', EMOJIS.workingInProgress);
  extendedDictionary.buildAllPlatforms();
  log('Styles compiled', EMOJIS.success);
};

const formatTokenToCssVariable = (token: TransformedToken) => `--${token.name}: ${token.value};`;

const formatTokenValueWithTheme = (token: TransformedToken) => {
  const name = token.name.split('-').slice(1).join('-');
  return {
    ...token,
    name
  };
};

const getColorTheme = (token: TransformedToken) => token.name.split('-')[0];

const splitColorsByTheme = (colors: TransformedToken[]) => {
  const colorsByTheme = {} as any;
  colors.forEach(token => {
    const theme = getColorTheme(token);
    if (!colorsByTheme[theme]) colorsByTheme[theme] = [];
    colorsByTheme[theme].push(formatTokenValueWithTheme(token));
  });
  return colorsByTheme;
};

const isColorToken = (token: TransformedToken) => token.type === 'color';

const addColorsThemeFormat = (themes: string[]) => {
  StyleDictionary.registerFormat({
    name: 'css/variables',
    formatter({ dictionary }) {
      const variables = dictionary.allProperties
        .map(token => {
          if (token.type === 'color') {
            const theme = getColorTheme(token);
            if (theme === 'default') {
              return formatTokenToCssVariable(formatTokenValueWithTheme(token));
            }
            return false;
          }

          return formatTokenToCssVariable(token);
        })
        .filter(Boolean)
        .join(' ');

      return `:root { ${variables} }\n`;
    }
  });

  StyleDictionary.registerFormat({
    name: 'css/variables-themes',
    formatter({ dictionary }) {
      const colors = dictionary.allProperties.filter(isColorToken);
      const colorsByTheme = splitColorsByTheme(colors);
      const variables = themes
        .map(theme => {
          const themeColors = colorsByTheme[theme];
          const cssVariables = themeColors.map(formatTokenToCssVariable).join(' ');
          return `[data-theme="${theme}"] { ${cssVariables} }`;
        })
        .join(' ');

      return `${variables}\n`;
    }
  });
};

const isThereThemeFormat = (styleDictionary: StyleDictionaryConfig) => {
  return styleDictionary.platforms.css.files?.some(file => file.format === 'css/variables-themes');
};

const buildStyleDictionary = (settings: Config) => {
  if (!settings.styleDictionary) {
    log('No Style Dictionary config found', EMOJIS.warning);
    return;
  }

  registerParsers();

  const { styleDictionary, figmaThemes, experimentalColorName = false } = settings;

  if (figmaThemes && isThereThemeFormat(styleDictionary)) {
    addColorsThemeFormat(figmaThemes);
  }

  if (experimentalColorName) {
    registerColorsParser();
  }

  buildStyles(styleDictionary);
};

export { buildStyleDictionary };
