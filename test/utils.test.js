'use strict';

const expect = require('chai').expect;

const utils = require('../src/utils');

describe('Utils functions', () => {
  const c = 0.65;
  const r = 100;
  const g = 50;
  const b = 33;
  const a = 0.8;

  describe('getColor', () => {
    const color = utils.getColor(c);

    it('is number', () => {
      expect(color).to.be.a('number');
    });
    it('equals result', () => {
      expect(color).to.equal(Math.round(c * 255));
    });
  });

  describe('rgbaGen', () => {
    const rgbaColor = utils.rgbaGen(r, g, b, a);
    const rgbColor = utils.rgbaGen(r, g, b);

    it('is string', () => {
      expect(rgbaColor).to.be.a('string');
    });
    it('equals result rgb', () => {
      expect(rgbColor).to.equal(`rgba(${utils.getColor(r)}, ${utils.getColor(g)}, ${utils.getColor(b)}, 1)`);
    });
    it('equals result rgba', () => {
      expect(rgbaColor).to.equal(`rgba(${utils.getColor(r)}, ${utils.getColor(g)}, ${utils.getColor(b)}, ${a})`);
    });
  });

  describe('parseRgba', () => {
    const rgbColor = utils.parseRgba({ r, g, b, a });

    it('is string', () => {
      expect(rgbColor).to.be.a('string');
    });
    it('equals result rgba', () => {
      expect(rgbColor).to.equal(`rgba(${r}, ${g}, ${b}, ${a})`);
    });
  });

  describe('rgbToHex', () => {
    const white = utils.rgbToHex(255);

    it('is string', () => {
      expect(white).to.be.a('string');
    });
    it('equals hex color', () => {
      expect(white).to.equal('ff');
    });
  });

  describe('fullColorHex', () => {
    const shortHex = utils.fullColorHex(r, r, r);
    const longHex = utils.fullColorHex(r, g, b);

    it('is string (shortHex)', () => {
      expect(shortHex).to.be.a('string');
    });
    it('equals (shortHex)', () => {
      const hexColor = `${utils.rgbToHex(r) + utils.rgbToHex(r) + utils.rgbToHex(r)}`.toLocaleLowerCase();
      expect(shortHex).to.equal(`#${hexColor.slice(0, 3)}`);
    });
    it('is string (longHex)', () => {
      expect(longHex).to.be.a('string');
    });
    it('equals (longHex)', () => {
      const hexColor = `${utils.rgbToHex(r) + utils.rgbToHex(g) + utils.rgbToHex(b)}`.toLocaleLowerCase();
      expect(longHex).to.equal(`#${hexColor}`);
    });
  });

  describe('pixelate', () => {
    const rndNum = Math.random() * 100;
    const pxNum = utils.pixelate(rndNum);

    it('is string', () => {
      expect(pxNum).to.be.a('string');
    });
    it('equals', () => {
      expect(pxNum).to.equal(`${Math.floor(rndNum)}px`);
    });
  });

  describe('genShadow', () => {
    const x = Math.floor(Math.random() * 100);
    const y = Math.floor(Math.random() * 100);
    const radius = Math.floor(Math.random() * 100);
    const shadow = utils.genShadow({ r, g, b, a }, { x, y }, radius);

    it('is string', () => {
      expect(shadow).to.be.a('string');
    });
    it('equals', () => {
      expect(shadow).to.equal(`${x}px ${y}px ${radius}px ${utils.parseRgba({ r, g, b, a })}`);
    });
  });

  describe('trim', () => {
    const trimStr = utils.trim('test string   ');

    it('is string', () => {
      expect(trimStr).to.be.a('string');
    });
    it('equals', () => {
      expect(trimStr).to.equal(`test string`);
    });
  });
});
