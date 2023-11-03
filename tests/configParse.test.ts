import { configFileParser } from '../src/functions';
import { ParseConfig } from '../src/types/designTokens';
import { Arguments } from 'yargs-parser';
import configFile from './mocks/template.config.json';

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
    jest.mock('fs', () => ({
      access: jest.fn().mockImplementation((path, mode, callback) => {
        callback(null);
      }),
      readFile: jest.fn().mockImplementation((path, callback) => {
        callback(null, JSON.stringify(configFile));
      }),
      readFileSync: jest.fn().mockImplementation((path, callback) => {
        callback(null, JSON.stringify(configFile));
      }),
      mkdirSync: jest.fn(),
      existsSync: jest.fn().mockReturnValue(true)
    }));

    config = await configFileParser(argv);
    configWithFile = await configFileParser(argvWithFile);
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
