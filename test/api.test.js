'use strict';

require = require("esm")(module /*, options */);
const fetch = require('node-fetch');
const expect = require('chai').expect;

const FETCH_URL = `https://api.figma.com/v1/files/laOdxGSyWrN0Of2HpeOX7Las`;
const FETCH_DATA = {
  method: 'GET',
  headers: {
    'X-Figma-Token': '44495-d07c957b-fe6b-49f6-9d4e-7a8c3156433c'
  }
};
const PAGE_NAME = '🔄 Design Tokens v2';
let figmaJson;

describe('Figma connection', () => {
  describe('Fetch project', () => {
    it('Project exists', async () => {
      await fetch(FETCH_URL, FETCH_DATA)
        .then(response => response.json())
        .then(response => {
          expect(response.status).to.not.equal(403);
          expect(response.cstatus).to.not.equal(404);
          figmaJson = response;
        });
    });
    it('Page exists', () => {
      const figmaTree = figmaJson.document.children.filter(page => page.name === PAGE_NAME);
      expect(figmaTree.length).to.be.greaterThan(0);
    })
  });
});
