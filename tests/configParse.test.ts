import { configFileParser } from '../src/functions';
import { ParseConfig } from '../src/types/designTokens';
import { Arguments } from 'yargs-parser';
import fsMock from './mocks/fsMock';

describe('Config parser', () => {
  let config: ParseConfig;
  let configWithFile: ParseConfig;
  const argvWithFile: Arguments = {
    '_': [],
    'config-file': '/tests/mocks/template.config.json',
    'configFile': '/tests/mocks/template.config.json'
  };
  const argv: Arguments = {
    '_': [],
    'config-file': '',
    'configFile': ''
  };
  const DEFAULT_CONFIG_FILE = 'designtokens.config.json';

  beforeAll(async () => {
    config = await configFileParser(argv, fsMock);
    configWithFile = await configFileParser(argvWithFile, fsMock);
  });

  it('should parse config file', () => {
    expect(config).toBeDefined();
    expect(config.settings).toBeDefined();
    expect(config.configFile).toBeDefined();
  });

  it('should have a config file as a json file', () => {
    expect(configWithFile.configFile).toMatch(argvWithFile['config-file']);
  });

  it('should get a default config file', () => {
    expect(config.configFile).toMatch(DEFAULT_CONFIG_FILE);
  });
});
