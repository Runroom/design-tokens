import fs from 'fs';
import path from 'path';

import { emojis } from './utils.js';

const parseConfigFile = argv => {
  const APP_DIR = path.resolve().split('/node_modules')[0];
  const CONFIG_FILE_DEFAULT1 = 'designtokens.config.json';
  const CONFIG_FILE_DEFAULT2 = 'design-tokens.config.json';

  const configFile = `${APP_DIR}/${
    argv['config-file'] || CONFIG_FILE_DEFAULT1 || CONFIG_FILE_DEFAULT2
  }`;

  return new Promise(resolve => {
    fs.access(configFile, fs.F_OK, err => {
      if (err) {
        throw new Error(
          `\n\x1b[31m${emojis.error} Config file is not accessible. please check the users's permissions on the file.\n`
        );
      }

      fs.readFile(configFile, 'utf8', (err, data) => {
        if (err) {
          throw new Error(
            `\n\x1b[31m${emojis.error} Config file not found.\nUse default 'designtokens.config.json' or specify a different one by using --config-file=FILENAME\n`
          );
        }

        const settings = JSON.parse(data);
        const { FIGMA_APIKEY, FIGMA_ID, FIGMA_PAGE_NAME } = settings;
        let { TOKENS_DIR } = settings;

        if (!FIGMA_APIKEY) {
          throw new Error(`\n\x1b[31m${emojis.error} No Figma API Key found\n`);
        } else if (!FIGMA_ID) {
          throw new Error(`\n\x1b[31m${emojis.error} No Figma ID found\n`);
        } else if (!FIGMA_PAGE_NAME) {
          throw new Error(`\n\x1b[31m${emojis.error} No Figma Page Name found\n`);
        } else if (!TOKENS_DIR || TOKENS_DIR === '') {
          // eslint-disable-next-line no-console
          console.warn(
            `${emojis.warning} No TOKENS_DIR found, default outdir is set to 'tokens'\n`
          );
          TOKENS_DIR = 'tokens';
        }

        if (!fs.existsSync(TOKENS_DIR)) {
          fs.mkdirSync(TOKENS_DIR, null, err => {
            if (err) throw err;
          });
        }

        resolve({ settings, configFile });
      });
    });
  });
};

export default parseConfigFile;
