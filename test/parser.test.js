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
    // genFile('color', generateTokens('Colors', figmaTree[0].children, getColors), outDir),
    // const artboardName = utils.camelCase('Colors');

    // console.log(mockJson);

    const elements = parser.filterArtboardElements('Colors', mockJson);

    console.log(elements)

    it('is object', () => {
      expect(elements).to.be.a('array');
    });
  });
});
