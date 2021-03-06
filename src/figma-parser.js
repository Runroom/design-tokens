import { promises as fsp } from 'fs';
import fetch from 'node-fetch';

import { getColors, getSpacings, getTypography } from './decorators';
import { snakeCase, emojis } from './utils';

const filterArtboardElements = (artboardName, stylesArtboard) =>
  stylesArtboard
    .filter(item => item.name === artboardName)[0]
    .children.filter(item => item.type === 'COMPONENT');

const generateTokens = (artboardName, stylesArtboard, decorator) => {
  const elements = filterArtboardElements(artboardName, stylesArtboard);
  const elementName = snakeCase(artboardName);
  const tokens = {
    [elementName]: {}
  };
  elements.map(element => {
    Object.assign(tokens[elementName], decorator(element));
  });
  return tokens;
};

const genFile = (name, tokens, outDir) =>
  fsp.writeFile(`${outDir}/${name}.json`, JSON.stringify(tokens, null, 2), err => {
    if (err) throw new Error(`\x1b[31m${emojis.error} ${err}\n\n`);
    console.log(` ${emojis[name]} ${name} tokens created!`);
  });

const parseTokens = (apikey, id, outDir, pageName, pages) =>
  new Promise((resolve, reject) => {
    console.log('\x1b[40m Connecting with Figma... \x1b[0m');
    const FETCH_URL = `https://api.figma.com/v1/files/${id}`;
    const FETCH_DATA = {
      method: 'GET',
      headers: {
        'X-Figma-Token': apikey
      }
    };

    try {
      fetch(FETCH_URL, FETCH_DATA)
        .then(response => {
          console.log(` Connection with Figma is successful ${emojis.success}!`);
          return response.json();
        })
        .then(styles => {
          if (styles.status !== 403 && styles.status !== 404) {
            const figmaTree = styles.document.children.filter(page => page.name === pageName);

            if (figmaTree.length === 0) throw new Error(`There is no page called '${pageName}'`);
            console.log(` Parsing Figma tokens...`);

            const promises = [];

            if (pages.includes('Colors')) {
              promises.push(
                genFile(
                  'colors',
                  generateTokens('Colors', figmaTree[0].children, getColors),
                  outDir
                )
              );
            }

            if (pages.includes('Typography')) {
              promises.push(
                genFile(
                  'typography',
                  generateTokens('Typography', figmaTree[0].children, getTypography),
                  outDir
                )
              );
            }

            if (pages.includes('Spacings')) {
              promises.push(
                genFile(
                  'spacings',
                  generateTokens('Spacings', figmaTree[0].children, getSpacings),
                  outDir
                )
              );
            }

            if (pages.includes('Breakpoints')) {
              promises.push(
                genFile(
                  'breakpoints',
                  generateTokens('Breakpoints', figmaTree[0].children, getBreakpoints),
                  outDir
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

export { filterArtboardElements, generateTokens, parseTokens };
