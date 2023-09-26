import fs from 'fs';
import { expect } from 'chai';
import { describe, it } from 'mocha';

import parseConfigFile from '../src/parse-config-file.js';

describe('parseConfigFile', () => {
  it('should resolve with settings and configFile when config file exists', async () => {
    const fakeConfig = {
      FIGMA_APIKEY: 'fake_api_key',
      FIGMA_ID: 'fake_id',
      FIGMA_PAGE_NAME: 'fake_page',
      TOKENS_DIR: 'fake_tokens_dir'
    };

    const tmpConfigFile = 'tmp_config.json';
    fs.writeFileSync(tmpConfigFile, JSON.stringify(fakeConfig));

    parseConfigFile({ 'config-file': tmpConfigFile }).then(result => {
      expect(result.settings).to.be.a('object');
      expect(result.settings.FIGMA_APIKEY).to.equal(fakeConfig.FIGMA_APIKEY);
      expect(result.settings.FIGMA_ID).to.equal(fakeConfig.FIGMA_ID);
      expect(result.settings.FIGMA_PAGE_NAME).to.equal(fakeConfig.FIGMA_PAGE_NAME);
      expect(result.settings.TOKENS_DIR).to.equal(fakeConfig.TOKENS_DIR);

      expect(result.configFile).to.be.a('string');

      fs.unlinkSync(tmpConfigFile);
    });
  });
});
