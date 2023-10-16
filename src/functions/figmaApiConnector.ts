import fetch from 'node-fetch';

import { getBreakpoints, getColors, getSpacings, getTypography } from './tokensParser.ts';
import { FigmaResponse } from '@/types/figma';
import { ColorJson } from '@/types/Color.ts';
import { TypographyJson } from '@/types/Typography.ts';
import { SpacingJson } from '@/types/Spacing.ts';
import { Config } from '@/types/Config.ts';
import { createFile } from './fileHelpers.ts';
import { generateCSSVariables, generateTypographyCSS } from './cssConvert.ts';
import { generateTokens } from '@/functions/figmaParser.ts';
import { EMOJIS } from '@/functions/output.ts';

const parseTokens = ({
  FIGMA_APIKEY,
  FIGMA_ID,
  FIGMA_PAGE_NAME,
  TOKENS_DIR,
  pages,
  themes
}: Config) =>
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
          console.log(` Connection with Figma is successful ${EMOJIS.success}!`);
          return response.json();
        })
        .then((response: unknown) => {
          if (!response) {
            throw new Error(`\x1b[31m\n\n${EMOJIS.error} No styles found\n`);
          }
          const figmaResponse = response as FigmaResponse;

          if (figmaResponse.status !== 403 && figmaResponse.status !== 404) {
            const figmaTree = figmaResponse.document.children.filter(
              page => page.name === FIGMA_PAGE_NAME
            );

            if (figmaTree.length === 0) {
              throw new Error(`There is no page called '${FIGMA_PAGE_NAME}'`);
            }
            // eslint-disable-next-line no-console
            console.log(` Parsing Figma tokens...`);

            const promises = [];
            const figmaDesignTokensPage = figmaTree[0];

            if (!figmaDesignTokensPage.children || figmaDesignTokensPage.children.length === 0) {
              return;
            }

            const figmaDesignTokensFrames = figmaDesignTokensPage.children;

            if (pages.includes('Colors')) {
              const colorTokens: ColorJson = generateTokens(
                'Colors',
                figmaDesignTokensFrames,
                getColors
              );

              const { hexVars, vars, hslVars } = generateCSSVariables(colorTokens, themes);

              promises.push(createFile('colors', colorTokens, TOKENS_DIR));
              promises.push(createFile('rgb-color-vars', vars, TOKENS_DIR, 'css'));
              promises.push(createFile('hex-color-vars', hexVars, TOKENS_DIR, 'css'));
              promises.push(createFile('hsl-color-vars', hslVars, TOKENS_DIR, 'css'));
            }

            if (pages.includes('Typography')) {
              const typographyTokens: TypographyJson = generateTokens(
                'Typography',
                figmaDesignTokensFrames,
                getTypography
              );

              promises.push(createFile('typography', typographyTokens, TOKENS_DIR));

              const { typographyVars } = generateTypographyCSS(typographyTokens);
              promises.push(createFile('typography-vars', typographyVars, TOKENS_DIR, 'css'));
            }

            if (pages.includes('Spacings')) {
              const spacingsTokens: SpacingJson = generateTokens(
                'Spacings',
                figmaDesignTokensFrames,
                getSpacings
              );

              promises.push(createFile('spacings', spacingsTokens, TOKENS_DIR));
            }

            if (pages.includes('Breakpoints')) {
              promises.push(
                createFile(
                  'breakpoints',
                  generateTokens('Breakpoints', figmaDesignTokensFrames, getBreakpoints),
                  TOKENS_DIR
                )
              );
            }

            Promise.all(promises)
              .then(() => {
                resolve(null);
              })
              .catch(err => {
                reject();
                throw new Error(`\x1b[31m\n\n${EMOJIS.error} ${err}\n`);
              });
          }
        })
        .catch(err => {
          throw new Error(`\x1b[31m\n\n${EMOJIS.error} ${err}\n`);
        });
    } catch (err) {
      throw new Error(`\x1b[31m\n\n${EMOJIS.error} ${err}\n`);
    }
  });

export default parseTokens;
