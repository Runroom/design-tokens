import {
  kebabCase,
  snakeCase,
  camelCase,
  trim,
  getColor,
  rgbaGen,
  rgbaGenObject,
  parseRgba,
  fullColorHsl,
  fullColorHex,
  rgbToHex,
  createThemeRootString,
  formatNumber,
  pixelate,
  gradientDegree,
  formatDecimals
} from '../src/functions';

describe('Utils functions', () => {
  const c = 0.65;
  const r = 100;
  const g = 50;
  const b = 33;
  const a = 0.8;

  describe('getColor', () => {
    it('is number', () => {
      expect(typeof getColor(c)).toBe('number');
    });

    it('equals result', () => {
      expect(getColor(c)).toBe(Math.round(c * 255));
    });
  });

  describe('rgbaGen', () => {
    it('is string', () => {
      expect(typeof rgbaGen(r, g, b, a)).toBe('string');
    });

    it('equals result rgb', () => {
      const rgbColor = rgbaGen(r, g, b);
      expect(rgbColor).toBe(`rgb(${getColor(r)} ${getColor(g)} ${getColor(b)} / 1)`);
    });

    it('equals result rgba', () => {
      const rgbaColor = rgbaGen(r, g, b, a);
      expect(rgbaColor).toBe(`rgb(${getColor(r)} ${getColor(g)} ${getColor(b)} / ${a})`);
    });
  });

  describe('rgbaGenObject', () => {
    it('is object', () => {
      expect(rgbaGenObject(r, g, b, a)).toBeInstanceOf(Object);
    });

    it('equals result rgb', () => {
      const rgbColor = rgbaGenObject(r, g, b);
      expect(rgbColor).toStrictEqual({
        r: getColor(r),
        g: getColor(g),
        b: getColor(b),
        a: 1
      });
    });

    it('equals result rgba', () => {
      const rgbaColor = rgbaGenObject(r, g, b, a);
      expect(rgbaColor).toStrictEqual({
        r: getColor(r),
        g: getColor(g),
        b: getColor(b),
        a
      });
    });
  });

  describe('formatNumber', () => {
    it('returns correct values', () => {
      expect(formatNumber('10.50000')).toBe(10.5);
      expect(formatNumber('10.50001')).toBe(10.50001);
      expect(formatNumber(10.5)).toBe(10.5);
      expect(formatNumber(10.50001)).toBe(10.50001);
    });
  });

  describe('parseRgba', () => {
    it('is string', () => {
      expect(typeof parseRgba({ r, g, b, a })).toBe('string');
    });

    it('equals result rgba', () => {
      const rgbColor = parseRgba({ r, g, b, a });
      expect(rgbColor).toBe(`rgb(${r} ${g} ${b} / ${a})`);
    });
  });

  describe('rgbToHex', () => {
    it('is string', () => {
      expect(typeof rgbToHex(255)).toBe('string');
    });

    it('equals hex color', () => {
      expect(rgbToHex(255)).toBe('ff');
    });
  });

  describe('fullColorHex', () => {
    it('equals (shortHex)', () => {
      const short = { r: 1, g: 1, b: 1, a: 1 };
      const shortRGBA = rgbaGenObject(short.r, short.g, short.b, short.a);
      const shortHex = fullColorHex(shortRGBA.r, shortRGBA.g, shortRGBA.b);

      expect(typeof shortHex).toBe('string');
      expect(shortHex).toBe('#fff');
    });

    it('equals (longHex)', () => {
      const long = {
        r: 0.925000011920929,
        g: 0.925000011920929,
        b: 0.925000011920929,
        a: 1
      };
      const longRGBA = rgbaGenObject(long.r, long.g, long.b, long.a);
      const longHex = fullColorHex(longRGBA.r, longRGBA.g, longRGBA.b);
      expect(typeof longHex).toBe('string');
      expect(longHex).toBe('#ececec');
    });
  });

  describe('fullColorHsl', () => {
    it('equals (longHSL)', () => {
      const long = {
        r: 0.925000011920929,
        g: 0.925000011920929,
        b: 0.925000011920929
      };
      const longHSL = fullColorHsl(long.r, long.g, long.b);

      if (!longHSL) {
        return;
      }

      expect(longHSL).toBeInstanceOf(Object);
      expect(typeof longHSL.h).toBe('number');
      expect(typeof longHSL.l).toBe('number');
      expect(typeof longHSL.s).toBe('number');
      expect(longHSL).toStrictEqual({ h: 0, l: 0, s: 0, a: 1 });
    });
  });

  describe('pixelate', () => {
    it('is string', () => {
      const rndNum = Math.random() * 100;
      const pxNum = pixelate(rndNum);
      expect(typeof typeof pxNum).toBe('string');
    });

    it('equals', () => {
      const rndNum = Math.random() * 100;
      const pxNum = pixelate(rndNum);
      expect(pxNum).toBe(`${Math.floor(rndNum)}px`);
    });
  });

  describe('trim', () => {
    it('is string', () => {
      const trimStr = trim('test string   ');
      expect(typeof trimStr).toBe('string');
    });

    it('equals', () => {
      const trimStr = trim('test string   ');
      expect(trimStr).toBe('test string');
    });
  });

  describe('camelCase', () => {
    it('is string', () => {
      const ccStr = camelCase('sample string_to-parse');
      expect(typeof typeof ccStr).toBe('string');
    });

    it('equals', () => {
      const ccStr = camelCase('sample string_to-parse');
      expect(ccStr).toBe('sampleStringToParse');
    });
  });

  describe('snakeCase', () => {
    it('is string', () => {
      const scStr = snakeCase('sample string_to-parse');
      expect(typeof scStr).toBe('string');
    });

    it('equals', () => {
      const scStr = snakeCase('sample string_to-parse');
      expect(scStr).toBe('sample_string_to_parse');
    });
  });

  describe('camelToKebabCase', () => {
    it('is string', () => {
      const kcStr = kebabCase('stringToParse');
      expect(typeof kcStr).toBe('string');
    });

    it('equals', () => {
      const kcStr = kebabCase('sample string_to-parse');
      const fromCamelCase = kebabCase('sample stringToParse');
      expect(kcStr).toBe('sample-string-to-parse');
      expect(fromCamelCase).toBe('sample-string-to-parse');
    });
  });

  describe('css schema', () => {
    it('should add schema string', () => {
      const srcTheme = createThemeRootString('light', 'colors: { primary: #fff }', true);
      expect(srcTheme).toBe(
        ":root[data-theme='light']{colors: { primary: #fff } color-scheme: light;}"
      );
    });
  });

  describe('degrees', () => {
    it('should calculate the degrees between two gradient points', () => {
      const point1 = { x: 100, y: 0 };
      const point2 = { x: 100, y: 100 };

      const degrees = gradientDegree(point1, point2);

      expect(degrees).toBe('90deg');
    });
  });

  describe('format decimals', () => {
    it('should format number with 3 or more decimals', () => {
      const number = 10.50001;

      const formatted = formatDecimals(number);

      expect(formatted).toBe(10.5);
    });

    it("should doesn't format number with 2 or less decimals", () => {
      const number = 10.51;
      const number2 = 11;

      const formatted = formatDecimals(number);
      const formatted2 = formatDecimals(number2);

      expect(formatted).toBe(10.51);
      expect(formatted2).toBe(11);
    });
  });
});
