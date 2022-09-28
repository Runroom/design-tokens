import fetch from 'node-fetch';
import { expect } from 'chai';
import { describe, before, it } from 'mocha';

import { getColors, getSpacings, getTypography } from '../src/decorators.js';
import { filterArtboards, generateTokens } from '../src/utils.js';

const FILE_ID = 'laOdxGSyWrN0Of2HpeOX7L';
const TOKEN = '44495-d07c957b-fe6b-49f6-9d4e-7a8c3156433c';
const FETCH_URL = `https://api.figma.com/v1/files/${FILE_ID}`;
const FETCH_DATA = {
  method: 'GET',
  headers: {
    'X-Figma-Token': TOKEN
  }
};
const PAGE_NAME = '🔄 Design Tokens';

describe('Figma connection', () => {
  let figmaJson;
  let figmaTree;

  before(async () => {
    await fetch(FETCH_URL, FETCH_DATA)
      .then(response => response.json())
      .then(async response => {
        figmaJson = response;
        figmaTree = await figmaJson.document.children.filter(page => page.name === PAGE_NAME);
      });
  });

  describe('Json fetching', () => {
    it(`Project with ID ${FILE_ID} exists`, () => {
      expect(figmaJson.status).to.not.equal(403);
      expect(figmaJson.status).to.not.equal(404);
    });

    it(`Page ${PAGE_NAME} exists`, () => {
      expect(figmaTree.length).to.be.greaterThan(0);
    });
  });

  describe('Json parsing', () => {
    describe('Color parser', () => {
      let colors;
      let tokens;
      let hexColor;
      let rgbColor;

      before(() => {
        tokens = generateTokens('Colors', figmaTree[0].children, getColors);
        colors = filterArtboards('Colors', figmaTree[0].children);
        hexColor = tokens['colors'][Object.keys(tokens['colors'])[0]].hexColor;
        rgbColor = tokens['colors'][Object.keys(tokens['colors'])[0]].rgbColor;
      });

      it('filtered artboard is array', () => {
        expect(colors).to.be.a('array');
      });

      it('tokens is object', () => {
        expect(tokens).to.be.a('object');
        expect(tokens['colors']).to.be.a('object');
        expect(Object.keys(tokens['colors']).length).to.be.greaterThan(0);
      });

      it('Hex value is valid', () => {
        expect(hexColor).to.be.a('string');
        expect(/#([0-9A-F]{3}|[0-9A-F]{6})/i.test(hexColor)).to.be.true;
      });

      it('RGB value to e an object', () => {
        expect(rgbColor).to.be.a('object');
      });
    });

    describe('Spacings parser', () => {
      let spacings;
      let tokens;
      let spacing;

      before(() => {
        tokens = generateTokens('Spacings', figmaTree[0].children, getSpacings);
        spacings = filterArtboards('Spacings', figmaTree[0].children);
        spacing = tokens['spacings'][Object.keys(tokens['spacings'])[0]].value;
      });

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
      let typography;
      let tokens;
      let text;

      before(() => {
        tokens = generateTokens('Typography', figmaTree[0].children, getTypography);
        typography = filterArtboards('Typography', figmaTree[0].children);
        text = tokens['typography'][Object.keys(tokens['typography'])[0]];
      });

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
        expect(text.rawFontSize).to.not.be.undefined;
        expect(text.fontWeight).to.not.be.undefined;
        expect(text.letterSpacing).to.not.be.undefined;
        expect(text.lineHeight).to.not.be.undefined;
      });

      it('props have valid types', () => {
        expect(text.fontFamily).to.be.a('string');
        expect(text.fontSize).to.be.a('string');
        expect(text.rawFontSize).to.be.a('number');
        expect(text.fontWeight).to.be.a('number');
        expect(text.lineHeight).to.be.a('number');
      });
    });
  });
});
