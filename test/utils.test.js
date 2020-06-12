'use strict';

const expect = require('chai').expect;

const utils = require('../src/utils');
const getRandomArbitrary = require('./helpers').getRandomArbitrary;

describe('Utils functions', () => {
  it('pixelate', () => {
    const rndNum = Math.random() * 100;
    const pxNum = utils.pixelate(rndNum);
    expect(pxNum).to.be.a('string');
    expect(pxNum).to.equal(`${Math.floor(rndNum)}px`);
  });

  it('parseRGBA', () => {
    const r = getRandomArbitrary(0, 255);
    const g = getRandomArbitrary(0, 255);
    const b = getRandomArbitrary(0, 255);
    const a = getRandomArbitrary(0, 255);
    const rgbColor = utils.parseRGBA({ r, g, b, a });

    expect(rgbColor).to.be.a('string');
    expect(rgbColor).to.equal(`rgba(${r}, ${g}, ${b}, ${a})`);
  });

  it('genShadow', () => {
    const r = getRandomArbitrary(0, 255);
    const g = getRandomArbitrary(0, 255);
    const b = getRandomArbitrary(0, 255);
    const a = getRandomArbitrary(0, 255);
    const x = Math.floor(Math.random() * 100);
    const y = Math.floor(Math.random() * 100);
    const radius = Math.floor(Math.random() * 100);
    const shadow = utils.genShadow({ r, g, b, a }, { x, y }, radius);

    expect(shadow).to.be.a('string');
    expect(shadow).to.equal(`${x}px ${y}px ${radius}px ${utils.parseRGBA({ r, g, b, a })}`);
  });
});
