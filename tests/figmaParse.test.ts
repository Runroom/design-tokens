import { DesignTokensGenerator, FigmaPages } from '../src/types/designTokens';
import response from './mocks/figmaTree.json';
import configFile from './mocks/designtokensrc.json';
import { isFigmaResponse } from '../src/functions';
import { parseFigma } from '../src/api';

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
  const NEUTRAL_100 = {
    name: 'neutral-100',
    value: '#f8f9fa',
    valueRgb: { r: 248, g: 249, b: 250, a: 1 },
    valueHsl: { h: 210, s: 17, l: 98, a: 1 }
  };

  beforeAll(() => {
    if (!isFigmaResponse(response)) {
      throw new Error(`No styles found`);
    }

    generatedTokens = parseFigma(response, configFile.figmaPages as FigmaPages);
    colors = generatedTokens?.find((token: DesignTokensGenerator) => token.name === 'Colors');
    gradients = generatedTokens?.find((token: DesignTokensGenerator) => token.name === 'Gradients');
    typographies = generatedTokens?.find(
      (token: DesignTokensGenerator) => token.name === 'Typographies'
    );
    shadows = generatedTokens?.find((token: DesignTokensGenerator) => token.name === 'Shadows');
    spacings = generatedTokens?.find((token: DesignTokensGenerator) => token.name === 'Spacings');
    borders = generatedTokens?.find((token: DesignTokensGenerator) => token.name === 'Borders');
    breakpoints = generatedTokens?.find(
      (token: DesignTokensGenerator) => token.name === 'Breakpoints'
    );
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
      color = colors?.tokens.colors['neutral']['100'];
    });

    it('should have colors', () => {
      expect(colors).toBeDefined();
    });

    it('should have colors with name, hex, rgb, hsl', () => {
      expect(color).toHaveProperty('name');
      expect(color).toHaveProperty('value');
      expect(color).toHaveProperty('valueRgb');
      expect(color).toHaveProperty('valueHsl');
    });

    it('should have colors well built', () => {
      expect(color).toMatchObject(NEUTRAL_100);
    });

    it('Hex value is valid', () => {
      const { value } = color;

      expect(typeof value).toBe('string');
      expect(/#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})/i.test(value)).toBe(true);
    });

    it('RGB value to be an object', () => {
      const { valueRgb } = color;

      expect(typeof valueRgb).toBe('object');
      expect(valueRgb.r).toBeGreaterThanOrEqual(0);
      expect(valueRgb.r).toBeLessThanOrEqual(255);
      expect(valueRgb.g).toBeGreaterThanOrEqual(0);
      expect(valueRgb.g).toBeLessThanOrEqual(255);
      expect(valueRgb.b).toBeGreaterThanOrEqual(0);
      expect(valueRgb.b).toBeLessThanOrEqual(255);
      expect(valueRgb.a).toBeGreaterThanOrEqual(0);
      expect(valueRgb.a).toBeLessThanOrEqual(1);
    });

    it('HSL value to be an array of decimals', () => {
      const { valueHsl } = color;

      expect(typeof valueHsl).toBe('object');
      expect(valueHsl.h).toBeGreaterThanOrEqual(0);
      expect(valueHsl.h).toBeLessThanOrEqual(360);
      expect(valueHsl.s).toBeGreaterThanOrEqual(0);
      expect(valueHsl.a).toBeLessThanOrEqual(1);
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
      expect(typography.value).toHaveProperty('fontFamily');
      expect(typography.value).toHaveProperty('fontSize');
      expect(typography.value).toHaveProperty('fontWeight');
      expect(typography.value).toHaveProperty('letterSpacing');
      expect(typography.value).toHaveProperty('lineHeight');
    });

    it('has correct props', () => {
      expect(typography.value.fontFamily).toBeDefined();
      expect(typography.value.fontSize).toBeDefined();
      expect(typography.value.fontWeight).toBeDefined();
      expect(typography.value.letterSpacing).toBeDefined();
      expect(typography.value.lineHeight).toBeDefined();
    });

    it('props have valid types', () => {
      expect(typeof typography.value.fontFamily).toBe('string');
      expect(typeof typography.value.fontSize).toBe('string');
      expect(typeof typography.value.fontWeight).toBe('number');
      expect(typeof typography.value.lineHeight).toBe('number');
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
      expect(spacing).toHaveProperty('value');
    });

    it('value is string', () => {
      expect(typeof spacing).toBe('object');
    });

    it('value is pixelated', () => {
      expect(/([0-9]+)rem/.test(spacing.value)).toBe(true);
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
    });
  });

  describe('Shadows', () => {
    it('should have shadows', () => {
      expect(shadows).toBeDefined();
    });

    it('should have shadows with correct properties', () => {
      const shadowKeys = Object.keys(shadows?.tokens.shadows);
      const shadow = shadows?.tokens.shadows[shadowKeys[0]];
      const subShadow = shadow.value[0];

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

      expect(gradient.value).toHaveProperty('type');
      expect(gradient.value).toHaveProperty('deg');
      expect(gradient.value).toHaveProperty('colors');
    });
  });
});
