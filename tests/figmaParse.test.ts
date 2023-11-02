import { DesignTokensGenerator, FigmaPages } from '../src/types/designTokens';
import response from './mocks/figmaTree.json';
import fileConfig from './mocks/template.config.json';
import { isFigmaResponse } from '../src/functions';
import { parseFigma } from '../src/api';
import {
  Borders,
  Breakpoints,
  Colors,
  Gradients,
  Shadows,
  Spacings,
  Typographies
} from '../src/classes';

jest.mock('node-fetch', () => jest.fn());

describe('Figma parser', () => {
  let generatedTokens: DesignTokensGenerator[] | undefined;
  let colors: any;
  let gradients: any;
  let typographies: any;
  let shadows: any;
  let spacings: any;
  let borders: any;
  let breakpoints: any;
  const NEUTRAL_WHITE = {
    name: 'neutral-white',
    hexColor: '#fff',
    rgbColor: { r: 255, g: 255, b: 255, a: 1 },
    hslColor: { h: 0, s: 0, l: 100, a: 1 }
  };
  const NEUTRAL_WHITE_KEY = 'neutralWhite';

  beforeAll(() => {
    if (!isFigmaResponse(response)) {
      throw new Error(`No styles found`);
    }

    generatedTokens = parseFigma(response, fileConfig.figmaPages as FigmaPages);
    colors = generatedTokens?.find(token => token instanceof Colors);
    gradients = generatedTokens?.find(token => token instanceof Gradients);
    typographies = generatedTokens?.find(token => token instanceof Typographies);
    shadows = generatedTokens?.find(token => token instanceof Shadows);
    spacings = generatedTokens?.find(token => token instanceof Spacings);
    borders = generatedTokens?.find(token => token instanceof Borders);
    breakpoints = generatedTokens?.find(token => token instanceof Breakpoints);
  });

  it("shouldn't be undefined", () => {
    expect(generatedTokens).toBeDefined();
  });

  it('should be an array', () => {
    expect(generatedTokens).toBeInstanceOf(Array);
  });

  it('should have 5 items', () => {
    expect(generatedTokens).toHaveLength(7);
  });

  describe('Colors', () => {
    let color: any;

    beforeAll(() => {
      color = colors?.tokens.colors[NEUTRAL_WHITE_KEY];
    });

    it('should have colors', () => {
      expect(colors).toBeDefined();
    });

    it('should have colors with name, hex, rgb, hsl', () => {
      expect(color).toHaveProperty('name');
      expect(color).toHaveProperty('hexColor');
      expect(color).toHaveProperty('rgbColor');
      expect(color).toHaveProperty('hslColor');
    });

    it('should have colors well built', () => {
      expect(color).toMatchObject(NEUTRAL_WHITE);
    });

    it('Hex value is valid', () => {
      const { hexColor } = color;

      expect(typeof hexColor).toBe('string');
      expect(/#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})/i.test(hexColor)).toBe(true);
    });

    it('RGB value to be an object', () => {
      const { rgbColor } = color;

      expect(typeof rgbColor).toBe('object');
      expect(rgbColor.r).toBeGreaterThanOrEqual(0);
      expect(rgbColor.r).toBeLessThanOrEqual(255);
      expect(rgbColor.g).toBeGreaterThanOrEqual(0);
      expect(rgbColor.g).toBeLessThanOrEqual(255);
      expect(rgbColor.b).toBeGreaterThanOrEqual(0);
      expect(rgbColor.b).toBeLessThanOrEqual(255);
      expect(rgbColor.a).toBeGreaterThanOrEqual(0);
      expect(rgbColor.a).toBeLessThanOrEqual(1);
    });

    it('HSL value to be an array of decimals', () => {
      const { hslColor } = color;

      expect(typeof hslColor).toBe('object');
      expect(hslColor.h).toBeGreaterThanOrEqual(0);
      expect(hslColor.h).toBeLessThanOrEqual(360);
      expect(hslColor.s).toBeGreaterThanOrEqual(0);
      expect(hslColor.a).toBeLessThanOrEqual(1);
    });
  });

  describe('Typographies', () => {
    let typography: any;

    beforeAll(() => {
      const typographyKeys = Object.keys(typographies?.tokens.typography);
      typography = typographies?.tokens.typography[typographyKeys[0]];
    });

    it('should have typographies', () => {
      expect(typographies).toBeDefined();
    });

    it('should have typographies with correct properties', () => {
      expect(typography).toHaveProperty('fontFamily');
      expect(typography).toHaveProperty('fontSize');
      expect(typography).toHaveProperty('fontWeight');
      expect(typography).toHaveProperty('letterSpacing');
      expect(typography).toHaveProperty('lineHeight');
    });

    it('has correct props', () => {
      expect(typography.fontFamily).toBeDefined();
      expect(typography.fontSize).toBeDefined();
      expect(typography.fontWeight).toBeDefined();
      expect(typography.letterSpacing).toBeDefined();
      expect(typography.lineHeight).toBeDefined();
    });

    it('props have valid types', () => {
      expect(typeof typography.fontFamily).toBe('string');
      expect(typeof typography.fontSize).toBe('string');
      expect(typeof typography.fontWeight).toBe('number');
      expect(typeof typography.lineHeight).toBe('number');
    });
  });

  describe('Spacings', () => {
    let spacing: any;

    beforeAll(() => {
      const spacingKeys = Object.keys(spacings?.tokens.spacings);
      spacing = spacings?.tokens.spacings[spacingKeys[0]];
    });

    it('should have spacings', () => {
      expect(spacings).toBeDefined();
    });

    it('should have spacings with correct properties', () => {
      expect(spacing).toHaveProperty('remValue');
      expect(spacing).toHaveProperty('value');
    });

    it('value is string', () => {
      expect(typeof spacing).toBe('object');
    });

    it('value is pixelated', () => {
      expect(/([0-9]+)px/.test(spacing.value)).toBe(true);
    });

    it('remValue is string', () => {
      expect(/([0-9]+)rem/.test(spacing.remValue)).toBe(true);
    });
  });

  describe('Breakpoints', () => {
    it('should have breakpoints', () => {
      expect(breakpoints).toBeDefined();
    });

    it('should have breakpoints with correct properties', () => {
      const breakpointKeys = Object.keys(breakpoints?.tokens.breakpoints);
      const breakpoint = breakpoints?.tokens.breakpoints[breakpointKeys[0]];

      expect(breakpoint).toHaveProperty('value');
      expect(breakpoint).toHaveProperty('remValue');
    });
  });

  describe('Shadows', () => {
    it('should have shadows', () => {
      expect(shadows).toBeDefined();
    });

    it('should have shadows with correct properties', () => {
      const shadowKeys = Object.keys(shadows?.tokens.shadows);
      const shadow = shadows?.tokens.shadows[shadowKeys[0]];
      const subShadow = shadow[0];

      expect(subShadow).toHaveProperty('color');
      expect(subShadow).toHaveProperty('offset');
      expect(subShadow).toHaveProperty('radius');
    });

    it('should have 4 shadows', () => {
      const shadowsLength = Object.keys(shadows?.tokens.shadows);

      expect(shadowsLength).toHaveLength(4);
    });
  });

  describe('Borders', () => {
    it('should have borders', () => {
      expect(borders).toBeDefined();
    });

    it('should have borders with correct properties', () => {
      const borderKeys = Object.keys(borders?.tokens.borders);
      const border = borders?.tokens.borders[borderKeys[0]];

      expect(border).toHaveProperty('value');
    });
  });

  describe('Gradients', () => {
    it('should have gradients', () => {
      expect(gradients).toBeDefined();
    });

    it('should have gradients with correct properties', () => {
      const gradientKeys = Object.keys(gradients?.tokens.gradients);
      const gradient = gradients?.tokens.gradients[gradientKeys[0]];

      expect(gradient).toHaveProperty('type');
      expect(gradient).toHaveProperty('deg');
      expect(gradient).toHaveProperty('colors');
    });
  });
});
