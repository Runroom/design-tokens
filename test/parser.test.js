'use strict';

require = require("esm")(module /*, options */);
const expect = require('chai').expect;
const parser = require('../src/figma-parser');
const utils = require('../src/utils');
// filterArtboardElements, generateTokens, parseTokens
const decorators = require('../src/decorators');
const mockJson = require('./data2')[0].children;

describe('Figma cli', () => {
  describe('Color parser', () => {
    const ARTBOARD_NAME = 'Colors';
    const colors = parser.filterArtboardElements(ARTBOARD_NAME, mockJson);
    const tokens = parser.generateTokens('Colors', mockJson, decorators.getColors);
    // genFile('color', generateTokens('Colors', figmaTree[0].children, getColors), outDir),
    // const artboardName = utils.camelCase('Colors');

    // console.log(mockJson);
    it('filtered artboard is array', () => {
      expect(colors).to.be.a('array');
    });
    it('tokens is object', () => {
      expect(tokens).to.be.a('object');
      expect(tokens['colors']).to.be.a('object');
    });
    it('value is string', () => {
      const color = tokens['colors'][Object.keys(tokens['colors'])[0]].value;
      expect(color).to.be.a('string');
    });
  });
});
