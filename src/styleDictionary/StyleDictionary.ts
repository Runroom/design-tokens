import StyleDictionary from 'style-dictionary';
import { EMOJIS, log } from '@/functions';
import { getGradientsParser, getShadowsParser, getTypographiesParser } from '@/tokens';

const registerParsers = () => {
  StyleDictionary.registerParser(getTypographiesParser());
  StyleDictionary.registerParser(getShadowsParser());
  StyleDictionary.registerParser(getGradientsParser());
};

const buildStyleDictionary = (configFilePath: string) => {
  registerParsers();

  const extendedDictionary = StyleDictionary.extend(configFilePath);

  log('Compiling styles...', EMOJIS.workingInProgress);
  extendedDictionary.buildAllPlatforms();
  log('Styles compiled', EMOJIS.success);
};

export { buildStyleDictionary };
