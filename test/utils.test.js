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

  describe('Color parsing functions', () => {
    const r = getRandomArbitrary(0, 255);
    const g = getRandomArbitrary(0, 255);
    const b = getRandomArbitrary(0, 255);
    const a = Math.random();

    it('getColor', () => {
      const c = Math.random();
      const color = utils.getColor(c);

      expect(color).to.be.a('number');
      expect(color).to.equal(Math.round(c * 255));
    });

    it('rgbaGen', () => {
      const rgbColor = utils.rgbaGen(r, g, b, a);

      expect(rgbColor).to.be.a('string');
      expect(rgbColor).to.equal(`rgba(${utils.getColor(r)}, ${utils.getColor(g)}, ${utils.getColor(b)}, ${a})`);
      expect(utils.rgbaGen(r, g, b)).to.equal(`rgba(${utils.getColor(r)}, ${utils.getColor(g)}, ${utils.getColor(b)}, 1)`);
    });

    it('parseRgba', () => {
      const rgbColor = utils.parseRgba({ r, g, b, a });

      expect(rgbColor).to.be.a('string');
      expect(rgbColor).to.equal(`rgba(${r}, ${g}, ${b}, ${a})`);
    });
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
    expect(shadow).to.equal(`${x}px ${y}px ${radius}px ${utils.parseRgba({ r, g, b, a })}`);
  });
});
