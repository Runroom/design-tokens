'use strict';

require = require("esm")(module /*, options */);
const expect = require('chai').expect;
const parser = require('../src/figma-parser');
const decorators = require('../src/decorators');
const mockJson = require('./data')[0].children;

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
    const typography = parser.filterArtboardElements('Typography', mockJson);
    const tokens = parser.generateTokens('Typography', mockJson, decorators.getTypography);
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
