'use strict';

require = require("esm")(module /*, options */);
const fetch = require('node-fetch');
const expect = require('chai').expect;
const parser = require('../src/figma-parser');
const decorators = require('../src/decorators');
// const mockJson = require('./data')[0].children;
// const assert = require('chai').assert;

const FETCH_URL = `https://api.figma.com/v1/files/laOdxGSyWrN0Of2HpeOX7L`;
const FETCH_DATA = {
  method: 'GET',
  headers: {
    'X-Figma-Token': '44495-d07c957b-fe6b-49f6-9d4e-7a8c3156433c'
  }
};
const PAGE_NAME = '🔄 Design Tokens v2';

describe('Figma connection', () => {
  let figmaJson;
  let figmaTree;

  beforeEach(async () => {
    await fetch(FETCH_URL, FETCH_DATA)
      .then(response => response.json())
      .then(response => {
        figmaJson = response;
        figmaTree = figmaJson.document.children.filter(page => page.name === PAGE_NAME);
      });
  });

  describe('Json fetching', () => {
    it(`Project with ID ${`laOdxGSyWrN0Of2HpeOX7L`} exists`, async () => {
      expect(figmaJson.status).to.not.equal(403);
      expect(figmaJson.status).to.not.equal(404);
    });
    it(`Page ${PAGE_NAME} exists`, () => {
      expect(figmaJson.document).to.exist;
      figmaTree = figmaJson.document.children.filter(page => page.name === PAGE_NAME);
      expect(figmaTree.length).to.be.greaterThan(0);
    });
  });

  describe('Json parsing', () => {
    describe('Color parser', () => {
      // const mockJson = figmaTree[0].children;
      console.log(figmaJson);
      console.log(figmaTree);

      const colors = parser.filterArtboardElements('Colors', figmaTree[0].children);
      const tokens = parser.generateTokens('Colors', figmaTree[0].children, decorators.getColors);
      const color = tokens['colors'][Object.keys(tokens['colors'])[0]].value;

      it('filtered artboard is array', () => {
        expect(colors).to.be.a('array');
      });
      it('tokens is object', () => {
        expect(tokens).to.be.a('object');
        expect(tokens['colors']).to.be.a('object');
      });
      it('value is string', () => {
        expect(color).to.be.a('string');
      });
      it('value is hexadecimal', () => {
        expect(/#([0-9A-F]{3}|[0-9A-F]{6})/i.test(color)).to.be.true;
      });
    });

    describe('Spacings parser', () => {
      const spacings = parser.filterArtboardElements('Spacings', figmaTree[0].children);
      const tokens = parser.generateTokens('Spacings', figmaTree[0].children, decorators.getSpacings);
      const spacing = tokens['spacings'][Object.keys(tokens['spacings'])[0]].value;

      it('filtered artboard is array', () => {
        expect(spacings).to.be.a('array');
      });
      it('tokens is object', () => {
        expect(tokens).to.be.a('object');
        expect(tokens['spacings']).to.be.a('object');
      });
      it('value is string', () => {
        expect(spacing).to.be.a('string');
      });
      it('value is pixelated', () => {
        expect(/([0-9]+)px/.test(spacing)).to.be.true;
      });
    });

    describe('Typography parser', () => {
      const typography = parser.filterArtboardElements('Typography', figmaTree[0].children);
      const tokens = parser.generateTokens('Typography', figmaTree[0].children, decorators.getTypography);
      const text = tokens['typography'][Object.keys(tokens['typography'])[0]];

      it('filtered artboard is array', () => {
        expect(typography).to.be.a('array');
      });
      it('tokens is object', () => {
        expect(tokens).to.be.a('object');
        expect(tokens['typography']).to.be.a('object');
      });
      it('has correct props', () => {
        expect(text.fontFamily).to.not.be.undefined;
        expect(text.fontSize).to.not.be.undefined;
        expect(text.lineHeight).to.not.be.undefined;
        expect(text.lineHeightRelative).to.not.be.undefined;
        expect(text.fontWeight).to.not.be.undefined;
      });
      it('props have valid types', () => {
        expect(/([0-9]+)px/.test(text.fontSize.value)).to.be.true;
        expect(/([0-9]+)px/.test(text.lineHeight.value)).to.be.true;
        expect(/[1-9]{1}00/.test(text.fontWeight.value)).to.be.true;
        expect(text.fontFamily.value).to.be.a('string');
        expect(text.lineHeightRelative.value).to.be.a('number');
      });
    });
  });
});
