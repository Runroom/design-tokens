'use strict';

const expect = require('chai').expect;

const utils = require('../src/utils');
const getRandomArbitrary = require('./helpers').getRandomArbitrary;

describe('Testing utils file functions', () => {
  it('Pixelates a value', () => {
    const rndNum = Math.random() * 100;
    const pxNum = utils.pixelate(rndNum);
    expect(pxNum).to.be.a('string');
    expect(pxNum).to.equal(`${Math.floor(rndNum)}px`);
  });

  it('Parses an rgba color', () => {
    const r = getRandomArbitrary(0, 255);
    const g = getRandomArbitrary(0, 255);
    const b = getRandomArbitrary(0, 255);
    const a = getRandomArbitrary(0, 255);
    const rgbColor = { r, g, b, a };

    expect(utils.parseRGBA(rgbColor)).to.be.a('string');
    expect(utils.parseRGBA(rgbColor)).to.equal(`rgba(${r}, ${g}, ${b}, ${a})`);
  });
});
