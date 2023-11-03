import configFile from './template.config.json';
import fs from 'fs';

jest.mock('fs', () => ({
  access: jest.fn().mockImplementation((path, mode, callback) => {
    return callback(null);
  }),
  accessSync: jest.fn().mockImplementation(() => {
    return null;
  }),
  readFile: jest.fn().mockImplementation((path, mode, callback) => {
    return callback(null, JSON.stringify(configFile));
  }),
  readFileSync: jest.fn().mockImplementation(() => {
    return JSON.stringify(configFile);
  }),
  mkdirSync: jest.fn(),
  existsSync: jest.fn().mockReturnValue(true),
  constants: {
    F_OK: 0
  }
}));

export default fs;
