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
          expect(styles.status).to.not.equal(403);
          expect(styles.status).to.not.equal(404);
          done();
        })
        .catch(err => {
          done(err);
        });
    });
  });
});
