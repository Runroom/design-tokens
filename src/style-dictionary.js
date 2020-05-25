function StyleDictionary(configFilePath) {
  const StyleDictionary = require('style-dictionary').extend(configFilePath);

  console.log(` Compiling styles...`);
  StyleDictionary.buildAllPlatforms();
}

module.exports = StyleDictionary;
