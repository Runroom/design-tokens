'use strict';

const expect = require('chai').expect;
const pixelate = require('../src/utils').pixelate;

describe('Testing utils file functions', () => {
  it('Pixelates a value', () => {
    const rndNum = Math.random() * 100;
    const pxNum = pixelate(rndNum);
    expect(pxNum).to.be.a('string');
    expect(pxNum).to.equal(`${Math.floor(rndNum)}px`);
  });
});
