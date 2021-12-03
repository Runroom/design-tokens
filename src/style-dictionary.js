import StyleDictionaryNode from 'style-dictionary';

const StyleDictionary = configFilePath => {
  const extendedDictionary = StyleDictionaryNode.extend(configFilePath);

  console.log(` Compiling styles...`);
  extendedDictionary.buildAllPlatforms();
};

export default StyleDictionary;
