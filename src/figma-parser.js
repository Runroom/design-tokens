import fetch from 'node-fetch';

import { getBreakpoints, getColors, getSpacings, getTypography } from './decorators.js';
import { createFile, emojis, generateCSSVariables, generateTokens } from './utils.js';

const parseTokens = ({ FIGMA_APIKEY, FIGMA_ID, FIGMA_PAGE_NAME, TOKENS_DIR, pages, themes }) =>
  new Promise((resolve, reject) => {
    // eslint-disable-next-line no-console
    console.log('\x1b[40m Connecting with Figma... \x1b[0m');

    const FETCH_URL = `https://api.figma.com/v1/files/${FIGMA_ID}`;
    const FETCH_DATA = {
      method: 'GET',
      headers: {
        'X-Figma-Token': FIGMA_APIKEY
      }
    };

    try {
      fetch(FETCH_URL, FETCH_DATA)
        .then(response => {
          // eslint-disable-next-line no-console
          console.log(` Connection with Figma is successful ${emojis.success}!`);
          return response.json();
        })
        .then(async styles => {
          if (styles.status !== 403 && styles.status !== 404) {
            const figmaTree = styles.document.children.filter(
              page => page.name === FIGMA_PAGE_NAME
            );

            if (figmaTree.length === 0)
              throw new Error(`There is no page called '${FIGMA_PAGE_NAME}'`);
            // eslint-disable-next-line no-console
            console.log(` Parsing Figma tokens...`);

            const promises = [];

            if (pages.includes('Colors')) {
              const colorTokens = await generateTokens('Colors', figmaTree[0].children, getColors);

              const { hexVars, vars, hslVars, tailwind } = await generateCSSVariables(
                colorTokens,
                themes
              );

              promises.push(createFile('colors', colorTokens, TOKENS_DIR));
              promises.push(createFile('rgb-color-vars', vars, TOKENS_DIR, 'css'));
              promises.push(createFile('hex-color-vars', hexVars, TOKENS_DIR, 'css'));
              promises.push(createFile('hsl-color-vars', hslVars, TOKENS_DIR, 'css'));
              promises.push(createFile('tailwind-color-vars', tailwind, TOKENS_DIR));
            }

            if (pages.includes('Typography')) {
              promises.push(
                createFile(
                  'typography',
                  generateTokens('Typography', figmaTree[0].children, getTypography),
                  TOKENS_DIR
                )
              );
            }

            if (pages.includes('Spacings')) {
              promises.push(
                createFile(
                  'spacings',
                  generateTokens('Spacings', figmaTree[0].children, getSpacings),
                  TOKENS_DIR
                )
              );
            }

            if (pages.includes('Breakpoints')) {
              promises.push(
                createFile(
                  'breakpoints',
                  generateTokens('Breakpoints', figmaTree[0].children, getBreakpoints),
                  TOKENS_DIR
                )
              );
            }

            Promise.all(promises)
              .then(() => {
                resolve();
              })
              .catch(err => {
                reject();
                throw new Error(`\x1b[31m\n\n${emojis.error} ${err}\n`);
              });
          }
        })
        .catch(err => {
          throw new Error(`\x1b[31m\n\n${emojis.error} ${err}\n`);
        });
    } catch (err) {
      throw new Error(`\x1b[31m\n\n${emojis.error} ${err}\n`);
    }
  });

export default parseTokens;
