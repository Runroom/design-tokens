'use strict';

require = require("esm")(module /*, options */);
const expect = require('chai').expect;
const parser = require('../src/figma-parser');
const utils = require('../src/utils');
const decorators = require('../src/decorators');
const mockJson = require('./data2')[0].children;

describe('Figma parser', () => {
  describe('Color parser', () => {
    const colors = parser.filterArtboardElements('Colors', mockJson);
    const tokens = parser.generateTokens('Colors', mockJson, decorators.getColors);
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
    const spacings = parser.filterArtboardElements('Spacings', mockJson);
    const tokens = parser.generateTokens('Spacings', mockJson, decorators.getSpacings);

    it('filtered artboard is array', () => {
      expect(spacings).to.be.a('array');
    });
    it('tokens is object', () => {
      expect(tokens).to.be.a('object');
      expect(tokens['spacings']).to.be.a('object');
    });
    // it('value is string', () => {
    //   const color = tokens['colors'][Object.keys(tokens['colors'])[0]].value;
    //   expect(color).to.be.a('string');
    // });
  });

  describe('Typography parser', () => {
    const typography = parser.filterArtboardElements('Typography', mockJson);
    const tokens = parser.generateTokens('Typography', mockJson, decorators.getTypography);

    it('filtered artboard is array', () => {
      expect(typography).to.be.a('array');
    });
    it('tokens is object', () => {
      expect(tokens).to.be.a('object');
      expect(tokens['typography']).to.be.a('object');
    });
    // it('value is string', () => {
    //   const color = tokens['colors'][Object.keys(tokens['colors'])[0]].value;
    //   expect(color).to.be.a('string');
    // });
  });
});
