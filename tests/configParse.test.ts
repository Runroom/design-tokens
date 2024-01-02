import { configFileParser } from '../src/functions';
import { Arguments } from 'yargs-parser';
import { Config } from '@/types/designTokens';

describe('Config parser', () => {
  describe('Config with file', () => {
    let configWithFile: Config;
    const argvWithFile: Arguments = {
      '_': [],
      'config-file': '/tests/mocks/designtokensrc.json',
      'configFile': '/tests/mocks/designtokensrc.json'
    };

    beforeAll(async () => {
      configWithFile = await configFileParser(argvWithFile);
    });

    it('should parse config file', () => {
      expect(configWithFile).toBeDefined();
    });

    it('should has figmaApiKey', () => {
      expect(configWithFile.figmaApiKey).toBeDefined();
    });

    it('should has figmaFileKey', () => {
      expect(configWithFile.figmaProjectId).toBeDefined();
    });
  });

  describe('Config without default file', () => {
    let config: Config;
    const argv: Arguments = {
      '_': [],
      'config-file': '/tests/mocks/designtokensrc.json',
      'configFile': '/tests/mocks/designtokensrc.json'
    };

    beforeAll(async () => {
      config = await configFileParser(argv);
    });

    it('should parse config file', () => {
      expect(config).toBeDefined();
    });

    it('should has figmaApiKey', () => {
      expect(config.figmaApiKey).toBeDefined();
    });

    it('should has figmaFileKey', () => {
      expect(config.figmaProjectId).toBeDefined();
    });
  });
});
