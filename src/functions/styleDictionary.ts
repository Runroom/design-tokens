import StyleDictionaryNode from 'style-dictionary';
import { EMOJIS, log } from './logger.ts';

const StyleDictionary = (configFilePath: string) => {
  const extendedDictionary = StyleDictionaryNode.extend(configFilePath);

  log('Compiling styles...', EMOJIS.workingInProgress);
  extendedDictionary.buildAllPlatforms();
  log('Styles compiled', EMOJIS.success);
};

export default StyleDictionary;
