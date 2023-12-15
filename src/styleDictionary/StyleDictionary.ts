import StyleDictionary, { Config as StyleDictionaryConfig } from 'style-dictionary';
import { EMOJIS, log } from '@/functions';
import { getGradientsParser, getShadowsParser, getTypographiesParser } from '@/tokens';
import { Config } from '@/types/designTokens';

const registerParsers = () => {
  StyleDictionary.registerParser(getTypographiesParser());
  StyleDictionary.registerParser(getShadowsParser());
  StyleDictionary.registerParser(getGradientsParser());
};

const getDarkModeSource = (source?: string[], outputDir?: string) => {
  const defaultJsonPath = `${outputDir}/**/*.dark.json`;

  if (!source) {
    return [defaultJsonPath];
  }

  return source.map(path => {
    if (path.indexOf(`.dark.json`) > -1) {
      return path;
    }

    return `${path.replace(`.json`, `.dark.json`)}`;
  });
};

const getDarkModeStyleDictionaryDefaultConfig = (settings: Config) => {
  const source = getDarkModeSource(settings.styleDictionary?.source, settings.outputDir);
  const buildPath =
    settings.styleDictionary!.platforms.css.buildPath ?? `${settings.outputDir}/tokens/`;

  return {
    include: source,
    source,
    filter: {
      dark: ({ filePath }: { filePath: string }) => filePath.indexOf(`.dark`) > -1
    },
    platforms: {
      css: {
        transformGroup: `css`,
        buildPath,
        files: [
          {
            destination: `variables-dark.css`,
            format: `css/variables`
          }
        ]
      }
    }
  };
};

const buildDarkModeStyles = (settings: Config) => {
  const darkModeConfig =
    settings.darkModeStyleDictionary ?? getDarkModeStyleDictionaryDefaultConfig(settings);

  const extendedDictionary = StyleDictionary.extend(darkModeConfig);

  log('Compiling dark mode styles...', EMOJIS.workingInProgress);
  extendedDictionary.buildAllPlatforms();
  log('Dark mode styles compiled', EMOJIS.success);
};

const buildStyles = (styleDictionary: StyleDictionaryConfig) => {
  const extendedDictionary = StyleDictionary.extend(styleDictionary);

  log('Compiling styles...', EMOJIS.workingInProgress);
  extendedDictionary.buildAllPlatforms();
  log('Styles compiled', EMOJIS.success);
};

const getStyleDictionaryWithoutDarkFiles = (
  styleDictionary: StyleDictionaryConfig
): StyleDictionaryConfig => {
  const source = styleDictionary.source
    ? styleDictionary.source.map(sourcePath => sourcePath.replace('*.json', '!(*.dark).json'))
    : [];

  return {
    ...styleDictionary,
    source,
    filter: {
      ...styleDictionary.filter,
      dark: ({ filePath }: { filePath: string }) => filePath.indexOf(`.dark`) === -1
    }
  };
};

const buildStyleDictionary = (settings: Config) => {
  if (!settings.styleDictionary) {
    log('No Style Dictionary config found', EMOJIS.warning);
    return;
  }

  registerParsers();

  const { darkMode, styleDictionary } = settings;

  if (darkMode) {
    const styleDictionaryWithoutDarkFiles = getStyleDictionaryWithoutDarkFiles(styleDictionary);
    buildStyles(styleDictionaryWithoutDarkFiles);
    buildDarkModeStyles(settings);
    return;
  }

  buildStyles(styleDictionary);
};

export { buildStyleDictionary };
