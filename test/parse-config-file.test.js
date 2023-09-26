'use strict';

import { expect } from 'chai';
import { describe, it } from 'mocha';
import fs from 'fs';
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

    const result = await parseConfigFile({ 'config-file': tmpConfigFile });
    expect(result.settings).to.deep.equal(fakeConfig);
    expect(result.configFile).to.be.a('string');

    fs.unlinkSync(tmpConfigFile);
  });
});
