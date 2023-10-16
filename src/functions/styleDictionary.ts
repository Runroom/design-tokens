import StyleDictionaryNode from 'style-dictionary';

const StyleDictionary = (configFilePath: string) => {
  const extendedDictionary = StyleDictionaryNode.extend(configFilePath);

  // eslint-disable-next-line no-console
  console.log(` Compiling styles...`);
  extendedDictionary.buildAllPlatforms();
};

export default StyleDictionary;
