'use strict';

require = require("esm")(module /*, options */);
const fetch = require('node-fetch');
const expect = require('chai').expect;
const assert = require('chai').assert;

const FETCH_URL = `https://api.figma.com/v1/files/laOdxGSyWrN0Of2HpeOX7La`;
const FETCH_DATA = {
  method: 'GET',
  headers: {
    'X-Figma-Token': '44495-d07c957b-fe6b-49f6-9d4e-7a8c3156433c'
  }
};
const PAGE_NAME = '🔄 Design Tokens v2';

describe('Figma project fetching', () => {
  let figmaJson;
  let fail = false;

  before(async () => {
    await fetch(FETCH_URL, FETCH_DATA)
      .then(response => response.json())
      .then(response => {
        figmaJson = response;
      });
  });
  afterEach(function() {
    if (fail) this.test.error(new Error('Couldn\'t complete tests'));
  })

  it('Project exists', async () => {
    expect(figmaJson.status).to.not.equal(403);
    expect(figmaJson.status).to.not.equal(404);
  });
  it('Page exists', () => {
    const figmaTree = figmaJson.document.children.filter(page => page.name === PAGE_NAME);
    expect(figmaTree.length).to.be.greaterThan(0);
  });
});
