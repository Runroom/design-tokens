'use strict';

require = require("esm")(module /*, options */);
const fetch = require('node-fetch');
const expect = require('chai').expect;

const FETCH_URL = `https://api.figma.com/v1/files/laOdxGSyWrN0Of2HpeOX7L`;
const FETCH_DATA = {
  method: 'GET',
  headers: {
    'X-Figma-Token': '44495-d07c957b-fe6b-49f6-9d4e-7a8c3156433c'
  }
};
const PAGE_NAME = '🔄 Design Tokens v2';

describe('Figma connection', () => {
  describe('Fetch project', () => {
    it('Project exists', done => {
      fetch(FETCH_URL, FETCH_DATA)
        .then(response => response.json())
        .then(styles => {
          console.log('Hola');
          // done();
          expect(styles.status).to.not.equal(403);
          expect(styles.status).to.not.equal(404);
          done();
          // if (styles.status !== 403 && styles.status !== 404) {
          //   const figmaTree = styles.document.children.filter(page => page.name === pageName);

          //   if (figmaTree.length === 0) throw new Error(`There is no page called '${pageName}'`);
          //   console.log(` Parsing Figma tokens...`);

          //   Promise.all([
          //     genFile('color', generateTokens('Colors', figmaTree[0].children, getColors), outDir),
          //     genFile('spacings', generateTokens('Spacings', figmaTree[0].children, getSpacings), outDir),
          //     genFile('typography', generateTokens('Typography', figmaTree[0].children, getTypography), outDir),
          //     // genFile('breakpoint', generateTokens('Breakpoints', figmaTree[0].children, getBreakpoints), outDir)
          //   ]).then(() => {
          //     resolve();
          //   }).catch(err => {
          //     reject();
          //     throw new Error(`\x1b[31m\n\n${emojis.error} ${err}\n`);
          // });
          // }
        })
        .catch(err => {
          done(err);
        });
    });
  });
});
