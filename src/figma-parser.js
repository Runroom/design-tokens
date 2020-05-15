import fs from 'fs';
import fetch from 'node-fetch'
import {
  getBreakpoints,
  getColors,
  getSpacing,
  getTypography
} from './types';
import { emojis } from './utils';

const genFile = (name, tokens, outDir) =>
  fs.writeFile(
    `${outDir}/${name}.json`,
    JSON.stringify(tokens, null, 2),
    err => {
      if (err) {
        throw new Error(`\x1b[31m${emojis.error} ${err}\n\n`)
      }
      // eslint-disable-next-line no-console
      console.log(
        `\x1b[32m ${
        emojis[name]
        } ${name.toUpperCase()} tokens created!\x1b[0m`
      )
    }
  );

const getTokens = (apikey, id, outDir, pageName) => {
  // eslint-disable-next-line no-console
  console.log('\x1b[40m Connecting with Figma... \x1b[0m');
  const FETCH_URL = `https://api.figma.com/v1/files/${id}`
  const FETCH_DATA = {
    method: 'GET',
    headers: {
      'X-Figma-Token': apikey
    }
  }

  try {
    fetch(FETCH_URL, FETCH_DATA)
      .then(response => {
        // eslint-disable-next-line no-console
        console.log(` Connection with Figma is successful ${emojis.success}!`);
        return response.json();
      })
      .then(styles => {
        if (styles.status !== 403 && styles.status !== 404) {
          const figmaTree = styles.document.children.filter(page => page.name === pageName);
          if (figmaTree.length === 0) throw new Error(`There is no page called '${pageName}'`);
          console.log(` Parsing Figma tokens...`);
          genFile('color', getColors('Colors', figmaTree[0]), outDir);
          genFile('spacing', getSpacing('Spacings', figmaTree[0]), outDir);
          genFile('typography', getTypography('Typography', figmaTree[0]), outDir);
          genFile('breakpoint', getBreakpoints('Breakpoints', figmaTree[0]), outDir);
        }
      })
      .catch(err => {
        throw new Error(`\x1b[31m\n\n${emojis.error} ${err}\n`);
      });
  } catch (err) {
    throw new Error(`\x1b[31m\n\n${emojis.error} ${err}\n`);
  }
}

export { getTokens };
