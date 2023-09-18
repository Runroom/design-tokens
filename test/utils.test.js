'use strict';

import { expect } from 'chai';
import { describe, it } from 'mocha';

import {
  camelCase,
  formatNumber,
  fullColorHex,
  fullColorHsl,
  genShadow,
  getColor,
  rgbaGen,
  rgbaGenObject,
  rgbToHex,
  parseRgba,
  pixelate,
  snakeCase,
  trim,
  hasDesktopAndMobileObjects,
  generateTypographyCss
} from '../src/utils.js';

describe('Utils functions', () => {
  const c = 0.65;
  const r = 100;
  const g = 50;
  const b = 33;
  const a = 0.8;

  describe('getColor', () => {
    const color = getColor(c);

    it('is number', () => {
      expect(color).to.be.a('number');
    });
    it('equals result', () => {
      expect(color).to.equal(Math.round(c * 255));
    });
  });

  describe('rgbaGen', () => {
    const rgbaColor = rgbaGen(r, g, b, a);
    const rgbColor = rgbaGen(r, g, b);

    it('is string', () => {
      expect(rgbaColor).to.be.a('string');
    });
    it('equals result rgb', () => {
      expect(rgbColor).to.equal(`rgba(${getColor(r)}, ${getColor(g)}, ${getColor(b)}, 1)`);
    });
    it('equals result rgba', () => {
      expect(rgbaColor).to.equal(`rgba(${getColor(r)}, ${getColor(g)}, ${getColor(b)}, ${a})`);
    });
  });

  describe('rgbaGenObject', () => {
    const rgbaColor = rgbaGenObject(r, g, b, a);
    const rgbColor = rgbaGenObject(r, g, b);

    it('is object', () => {
      expect(rgbaColor).to.be.a('object');
    });
    it('equals result rgb', () => {
      expect(rgbColor).to.deep.equal({
        r: getColor(r),
        g: getColor(g),
        b: getColor(b),
        a: 1
      });
    });
    it('equals result rgba', () => {
      expect(rgbaColor).to.deep.equal({
        r: getColor(r),
        g: getColor(g),
        b: getColor(b),
        a
      });
    });
  });

  describe('formatNumber', () => {
    it('returns correct values', () => {
      expect(formatNumber('10.50000')).to.equal(10.5);
      expect(formatNumber('10.50001')).to.equal(10.50001);
      expect(formatNumber(10.5)).to.equal(10.5);
      expect(formatNumber(10.50001)).to.equal(10.50001);
    });
  });

  describe('parseRgba', () => {
    const rgbColor = parseRgba({ r, g, b, a });

    it('is string', () => {
      expect(rgbColor).to.be.a('string');
    });
    it('equals result rgba', () => {
      expect(rgbColor).to.equal(`rgba(${r}, ${g}, ${b}, ${a})`);
    });
  });

  describe('rgbToHex', () => {
    const white = rgbToHex(255);

    it('is string', () => {
      expect(white).to.be.a('string');
    });
    it('equals hex color', () => {
      expect(white).to.equal('ff');
    });
  });

  describe('fullColorHex', () => {
    const long = {
      r: 0.925000011920929,
      g: 0.925000011920929,
      b: 0.925000011920929,
      a: 1
    }; // #ececec
    const short = { r: 1, g: 1, b: 1, a: 1 }; // #fff

    const shortRGBA = rgbaGenObject(short.r, short.g, short.b, short.a);
    const longRGBA = rgbaGenObject(long.r, long.g, long.b, long.a);
    const shortHex = fullColorHex(shortRGBA.r, shortRGBA.g, shortRGBA.b);
    const longHex = fullColorHex(longRGBA.r, longRGBA.g, longRGBA.b);

    it('equals (shortHex)', () => {
      expect(shortHex).to.be.a('string');
      expect(shortHex).to.equal('#fff');
    });

    it('equals (longHex)', () => {
      expect(longHex).to.be.a('string');
      expect(longHex).to.equal('#ececec');
    });
  });

  describe('fullColorHsl', () => {
    const long = {
      r: 0.925000011920929,
      g: 0.925000011920929,
      b: 0.925000011920929
    }; // #ececec

    const longHSL = fullColorHsl(long.r, long.g, long.b);

    it('equals (longHSL)', () => {
      expect(longHSL).to.be.a('array');
      expect(longHSL[0]).to.be.a('number');
      expect(longHSL[1]).to.be.a('number');
      expect(longHSL[2]).to.be.a('number');
    });

    it('equals (longHSL)', () => {
      expect(longHSL).to.deep.equal([0, 0, 0.003627451027140898]);
    });
  });

  describe('pixelate', () => {
    const rndNum = Math.random() * 100;
    const pxNum = pixelate(rndNum);

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
    const shadow = genShadow({ r, g, b, a }, { x, y }, radius);

    it('is string', () => {
      expect(shadow).to.be.a('string');
    });
    it('equals', () => {
      expect(shadow).to.equal(`${x}px ${y}px ${radius}px ${parseRgba({ r, g, b, a })}`);
    });
  });

  describe('trim', () => {
    const trimStr = trim('test string   ');

    it('is string', () => {
      expect(trimStr).to.be.a('string');
    });
    it('equals', () => {
      expect(trimStr).to.equal(`test string`);
    });
  });

  describe('camelCase', () => {
    const ccStr = camelCase('sample string_to-parse');

    it('is string', () => {
      expect(ccStr).to.be.a('string');
    });
    it('equals', () => {
      expect(ccStr).to.equal(`sampleStringToParse`);
    });
  });

  describe('snakeCase', () => {
    const ccStr = snakeCase('sample string_to-parse');

    it('is string', () => {
      expect(ccStr).to.be.a('string');
    });
    it('equals', () => {
      expect(ccStr).to.equal(`sample_string_to_parse`);
    });
  });

  describe('hasDesktopAndMobileObjects', () => {
    it('should return true if both desktop and mobile objects are present', () => {
      const testData = {
        desktopFont: 'Arial',
        mobileFont: 'Helvetica'
      };
      const result = hasDesktopAndMobileObjects(testData);
      expect(result).to.be.true;
    });

    it('should return false if either desktop or mobile object is missing', () => {
      const testData = {
        desktopFont: 'Arial'
      };
      const result = hasDesktopAndMobileObjects(testData);
      expect(result).to.be.false;
    });
  });

  describe('generateTypographyCss', () => {
    it('should generate CSS for typography data', () => {
      const typographyData = {
        mobileHeading: {
          fontSize: '16px',
          fontWeight: 'bold'
        }
      };
      const cssProperties = ['fontSize', 'fontWeight'];

      const expectedCss = '.heading {  fontSize: 16px;  fontWeight: bold; }';

      const generatedCss = generateTypographyCss(typographyData, cssProperties);
      expect(generatedCss).to.equal(expectedCss);
    });

    it('should include desktop CSS when available', () => {
      const typographyData = {
        mobileHeading: {
          fontSize: '16px'
        },
        desktopHeading: {
          fontSize: '24px'
        }
      };
      const cssProperties = ['fontSize'];

      const expectedCss = `.heading {  fontSize: 16px; @media (min-width: 1200px) {  fontSize: 24px; } }`;

      const generatedCss = generateTypographyCss(typographyData, cssProperties);
      expect(generatedCss).to.equal(expectedCss);
    });
  });
});
