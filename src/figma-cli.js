import fs from 'fs';

import { parseTokens } from '../src/figma-parser.js';
import { emojis } from '../src/utils.js';

const figmaCli = configFilePath =>
  new Promise((resolve, reject) => {
    fs.access(configFilePath, fs.F_OK, err => {
      fs.readFile(configFilePath, 'utf8', async (err, data) => {
        if (err) {
          throw new Error(
            `\n\x1b[31m${emojis.error} Config file not found.\nUse default 'designtokens.config.json' or specify a different one by using --config-file=FILENAME\n`
          );
        }

        const settings = JSON.parse(data);
        const { FIGMA_APIKEY, FIGMA_ID, FIGMA_PAGE_NAME, TOKENS_DIR, pages } = settings;

        if (!FIGMA_APIKEY) {
          return console.error(`${emojis.error} No Figma API Key found`);
        } else if (!FIGMA_ID) {
          return console.error(`${emojis.error} No Figma ID found`);
        } else if (!FIGMA_PAGE_NAME) {
          return console.error(`${emojis.error} No Figma Page Name found`);
        } else {
          let outDir;

          if (!TOKENS_DIR || TOKENS_DIR === '') {
            console.warn(`${emojis.warning} No outdir found, default outdir is 'tokens'\n`);
            outDir = 'tokens';
          } else {
            outDir = TOKENS_DIR;
          }
          if (!fs.existsSync(outDir)) {
            await fs.mkdirSync(outDir, null, err => {
              if (err) throw err;
            });
          }

          parseTokens(FIGMA_APIKEY, FIGMA_ID, outDir, FIGMA_PAGE_NAME, pages)
            .then(() => {
              resolve();
            })
            .catch(err => {
              reject();
            });
        }
      });
    });
  });

export default figmaCli;
