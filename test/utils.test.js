'use strict';

const expect = require('chai').expect;

const utils = require('../src/utils');
const getRandomArbitrary = require('./helpers').getRandomArbitrary;

describe('Utils functions', () => {
  const c = 0.65;
  const r = 100;
  const g = 50;
  const b = 33;
  const a = 0.8;

  it('getColor', () => {
    const color = utils.getColor(c);

    expect(color).to.be.a('number');
    expect(color).to.equal(Math.round(c * 255));
  });

  it('rgbaGen', () => {
    const rgbaColor = utils.rgbaGen(r, g, b, a);
    const rgbColor = utils.rgbaGen(r, g, b);

    expect(rgbaColor).to.be.a('string');
    expect(rgbaColor).to.equal(`rgba(${utils.getColor(r)}, ${utils.getColor(g)}, ${utils.getColor(b)}, ${a})`);
    expect(rgbColor).to.equal(`rgba(${utils.getColor(r)}, ${utils.getColor(g)}, ${utils.getColor(b)}, 1)`);
  });

  it('parseRgba', () => {
    const rgbColor = utils.parseRgba({ r, g, b, a });

    expect(rgbColor).to.be.a('string');
    expect(rgbColor).to.equal(`rgba(${r}, ${g}, ${b}, ${a})`);
  });

  describe('fullColorHex', () => {
    it('shortHex', () => {
      const shortHex = utils.fullColorHex(r, r, r);
      const hexColor = `${utils.rgbToHex(r) + utils.rgbToHex(r) + utils.rgbToHex(r)}`.toLocaleLowerCase();
      expect(shortHex).to.be.a('string');
      expect(shortHex).to.equal(`#${hexColor.slice(0, 3)}`);
    });

    it('longHex', () => {
      const longHex = utils.fullColorHex(r, g, b);
      const hexColor = `${utils.rgbToHex(r) + utils.rgbToHex(g) + utils.rgbToHex(b)}`.toLocaleLowerCase();
      expect(longHex).to.be.a('string');
      expect(longHex).to.equal(`#${hexColor}`);
    });
  })

  it('pixelate', () => {
    const rndNum = Math.random() * 100;
    const pxNum = utils.pixelate(rndNum);
    expect(pxNum).to.be.a('string');
    expect(pxNum).to.equal(`${Math.floor(rndNum)}px`);
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

  it('trim', () => {
    const trimStr = utils.trim('test string   ');
    expect(trimStr).to.be.a('string');
    expect(trimStr).to.equal(`test string`);
  });
});
