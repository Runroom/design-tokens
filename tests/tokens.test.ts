import response from './mocks/figmaTree.json';
import {
  Borders,
  Breakpoints,
  Colors,
  Gradients,
  Shadows,
  Spacings,
  Typographies
} from '../src/tokens';
import { FigmaFrame } from '../src/types/figma';
import {
  Border,
  Breakpoint,
  DesignTokensGenerator,
  GradientToken,
  ShadowToken,
  SpacingToken,
  TokenPayload,
  TypographyToken
} from '../src/types/designTokens';
import StyleDictionary from 'style-dictionary';

describe('Tokens', () => {
  let figmaPage: any;

  beforeAll(() => {
    figmaPage = response.document.children.find(figmaPage => figmaPage.name === '🔄 Design Tokens');
    jest.spyOn(StyleDictionary, 'buildAllPlatforms');
  });

  describe('Borders', () => {
    let borders: DesignTokensGenerator;
    let figmaFrame: any;

    beforeAll(() => {
      figmaFrame = figmaPage.children.find(
        (figmaFrame: FigmaFrame) => figmaFrame.name === 'Borders'
      );
      const payload = { frame: figmaFrame } as TokenPayload;
      borders = Borders(payload);
    });

    it('should create Borders tokens', () => {
      const tokens = borders.tokens;

      expect(tokens).toBeDefined();
    });

    it('should build tokens', () => {
      const borderCollection = borders.tokens.borders;
      const borderToken = borderCollection['small'] as Border;

      expect(borderCollection).toBeDefined();
      expect(borderToken).toBeDefined();
      expect(borderToken.value).toMatch('0.125rem');
    });

    it('should write tokens', () => {
      const createFile = jest.fn();
      const outputDir = 'tokens';
      const name = 'borders';

      borders.writeTokens(createFile, outputDir, name);

      expect(createFile).toHaveBeenCalledWith(name, borders.tokens, outputDir, 'json');
    });
  });

  describe('Breakpoints', () => {
    let breakpoints: DesignTokensGenerator;
    let figmaFrame: any;

    beforeAll(() => {
      figmaFrame = figmaPage.children.find(
        (figmaFrame: FigmaFrame) => figmaFrame.name === 'Breakpoints'
      );
      const payload = { frame: figmaFrame } as TokenPayload;
      breakpoints = Breakpoints(payload);
    });

    it('should create Breakpoints tokens', () => {
      const tokens = breakpoints.tokens;

      expect(tokens).toBeDefined();
    });

    it('should build tokens', () => {
      const breakpointCollection = breakpoints.tokens.breakpoints;
      const breakpointToken = breakpointCollection['tablet'] as Breakpoint;

      expect(breakpointCollection).toBeDefined();
      expect(breakpointToken).toBeDefined();
      expect(breakpointToken.value).toMatch('768px');
    });

    it('should write tokens', () => {
      const createFile = jest.fn();
      const outputDir = 'tokens';
      const name = 'breakpoints';

      breakpoints.writeTokens(createFile, outputDir, name);

      expect(createFile).toHaveBeenCalledWith(name, breakpoints.tokens, outputDir, 'json');
    });
  });

  describe('Colors', () => {
    let colors: DesignTokensGenerator;
    let figmaFrame: any;

    beforeAll(() => {
      figmaFrame = figmaPage.children.find(
        (figmaFrame: FigmaFrame) => figmaFrame.name === 'Colors'
      );
      const payload = { frame: figmaFrame } as TokenPayload;
      colors = Colors(payload);
    });

    it('should create Colors tokens', () => {
      const tokens = colors.tokens;

      expect(tokens).toBeDefined();
    });

    it('should build tokens', () => {
      const colorCollection = colors.tokens.colors;
      const colorToken = (colorCollection['neutral'] as any)['100'];

      expect(colorToken.value).toMatch('#f8f9fa');
      expect(colorToken.valueHsl).toMatchObject({
        h: 210,
        s: 17,
        l: 98,
        a: 1.0
      });
      expect(colorToken.valueRgb).toMatchObject({
        r: 248,
        g: 249,
        b: 250,
        a: 1.0
      });
    });

    it('should write tokens', () => {
      const createFile = jest.fn();
      const outputDir = 'tokens';
      const name = 'colors';

      colors.writeTokens(createFile, outputDir, name);

      expect(createFile).toHaveBeenCalledWith(name, colors.tokens, outputDir, 'json');
    });
  });

  describe('Gradients', () => {
    let gradients: DesignTokensGenerator;
    let figmaFrame: any;

    beforeAll(() => {
      figmaFrame = figmaPage.children.find(
        (figmaFrame: FigmaFrame) => figmaFrame.name === 'Gradients'
      );
      const payload = { frame: figmaFrame } as TokenPayload;
      gradients = Gradients(payload);
    });

    it('should create Gradients tokens', () => {
      const tokens = gradients.tokens;

      expect(tokens).toBeDefined();
    });

    it('should build tokens', () => {
      const gradientCollection = gradients.tokens.gradients as GradientToken;
      const gradientToken = gradientCollection['radial_generic_dark'];

      expect(gradientToken).toBeDefined();
      expect(gradientToken.value).toMatchObject({
        type: 'radial-gradient',
        deg: 'circle',
        colors: [
          {
            color: {
              r: 100,
              g: 116,
              b: 139,
              a: 1
            },
            position: 0
          },
          {
            color: {
              r: 15,
              g: 23,
              b: 42,
              a: 1
            },
            position: 1
          }
        ]
      });
    });

    it('should write tokens', () => {
      const createFile = jest.fn();
      const outputDir = 'tokens';
      const name = 'gradients';

      gradients.writeTokens(createFile, outputDir, name);

      expect(createFile).toHaveBeenCalledWith(name, gradients.tokens, outputDir, 'json');
    });
  });

  describe('Shadows', () => {
    let shadows: DesignTokensGenerator;
    let figmaFrame: any;

    beforeAll(() => {
      figmaFrame = figmaPage.children.find(
        (figmaFrame: FigmaFrame) => figmaFrame.name === 'Shadows'
      );
      const payload = { frame: figmaFrame } as TokenPayload;
      shadows = Shadows(payload);
    });

    it('should create Shadows tokens', () => {
      const tokens = shadows.tokens;

      expect(tokens).toBeDefined();
    });

    it('should build tokens', () => {
      const shadowCollection = shadows.tokens.shadows as ShadowToken;
      const shadowToken = shadowCollection['small'];

      expect(shadowToken).toBeDefined();
      expect(shadowToken.value).toMatchObject([
        {
          color: {
            r: 0.11764705926179886,
            g: 0.16078431904315948,
            b: 0.23137255012989044,
            a: 0.12999999523162842
          },
          offset: {
            x: 0,
            y: 2
          },
          radius: 4
        },
        {
          color: {
            r: 0.11764705926179886,
            g: 0.16078431904315948,
            b: 0.23137255012989044,
            a: 0.10000000149011612
          },
          offset: {
            x: 0,
            y: 1
          },
          radius: 1
        }
      ]);
    });

    it('should write tokens', () => {
      const createFile = jest.fn();
      const outputDir = 'tokens';
      const name = 'shadows';

      shadows.writeTokens(createFile, outputDir, name);

      expect(createFile).toHaveBeenCalledWith(name, shadows.tokens, outputDir, 'json');
    });
  });

  describe('Spacings', () => {
    let spacings: DesignTokensGenerator;
    let figmaFrame: any;

    beforeAll(() => {
      figmaFrame = figmaPage.children.find(
        (figmaFrame: FigmaFrame) => figmaFrame.name === 'Spacings'
      );
      const payload = { frame: figmaFrame } as TokenPayload;
      spacings = Spacings(payload);
    });

    it('should create Spacings tokens', () => {
      const tokens = spacings.tokens;

      expect(tokens).toBeDefined();
    });

    it('should build tokens', () => {
      const spacingCollection = spacings.tokens.spacings as SpacingToken;
      const spacingToken = spacingCollection['sm'];

      expect(spacingToken).toBeDefined();
      expect(spacingToken).toMatchObject({
        value: '1rem'
      });
    });

    it('should write tokens', () => {
      const createFile = jest.fn();
      const outputDir = 'tokens';
      const name = 'spacings';

      spacings.writeTokens(createFile, outputDir, name);

      expect(createFile).toHaveBeenCalledWith(name, spacings.tokens, outputDir, 'json');
    });
  });

  describe('Typography', () => {
    let typography: DesignTokensGenerator;
    let figmaFrame: any;

    beforeAll(() => {
      figmaFrame = figmaPage.children.find(
        (figmaFrame: FigmaFrame) => figmaFrame.name === 'Typography'
      );
      const payload = { frame: figmaFrame } as TokenPayload;
      typography = Typographies(payload);
    });

    it('should create Typography tokens', () => {
      const tokens = typography.tokens;

      expect(tokens).toBeDefined();
    });

    it('should build tokens', () => {
      const typographyCollection = typography.tokens.typography as TypographyToken;
      const typographyToken = typographyCollection['mobileTitle1'];

      expect(typographyToken).toBeDefined();
      expect(typographyToken.value).toMatchObject({
        fontFamily: 'Roboto',
        fontSize: '3.81437rem',
        fontWeight: 500,
        letterSpacing: 0,
        lineHeight: 1.12
      });
    });

    it('should write tokens', () => {
      const createFile = jest.fn();
      const outputDir = 'tokens';
      const name = 'typography';

      typography.writeTokens(createFile, outputDir, name);

      expect(createFile).toHaveBeenCalledWith(name, typography.tokens, outputDir, 'json');
    });
  });
});
