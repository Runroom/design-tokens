import response from './mocks/figmaTree.json';
import { Borders, Colors, Gradients, Shadows, Spacings, Typographies } from '../src/classes';
import { FigmaFrame } from '../src/types/figma';
import cssTokens from './mocks/cssTokens';

describe('Tokens', () => {
  let figmaPage: any;

  beforeAll(() => {
    figmaPage = response.document.children.find(figmaPage => figmaPage.name === '🔄 Design Tokens');
  });

  describe('Borders', () => {
    let borders: Borders;
    let figmaFrame: any;

    beforeAll(() => {
      figmaFrame = figmaPage.children.find(
        (figmaFrame: FigmaFrame) => figmaFrame.name === 'Borders'
      );
      borders = new Borders(figmaFrame);
    });

    it('should create Borders tokens', () => {
      const tokens = borders.tokens;

      expect(tokens).toBeDefined();
    });

    it('should build tokens', () => {
      const borderCollection = borders.tokens.borders;
      const borderToken = borderCollection['small'];

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

    it('should write css variables', () => {
      const createFile = jest.fn();
      const outputDir = 'tokens';
      const name = 'borders-vars';

      borders.writeCssVariables(createFile, outputDir, name);

      expect(createFile).toHaveBeenCalledWith(name, cssTokens.Borders, outputDir, 'css');
    });
  });

  describe('Colors', () => {
    let colors: Colors;
    let figmaFrame: any;

    beforeAll(() => {
      figmaFrame = figmaPage.children.find(
        (figmaFrame: FigmaFrame) => figmaFrame.name === 'Colors'
      );
      colors = new Colors(figmaFrame);
    });

    it('should create Colors tokens', () => {
      const tokens = colors.tokens;

      expect(tokens).toBeDefined();
    });

    it('should build tokens', () => {
      const colorCollection = colors.tokens.colors;
      const colorToken = colorCollection['neutral100'];

      expect(colorToken.hexColor).toMatch('#f8f9fa');
      expect(colorToken.hslColor).toMatchObject({
        h: 210,
        s: 17,
        l: 98,
        a: 1.0
      });
      expect(colorToken.rgbColor).toMatchObject({
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

    it('should write css variables', () => {
      const createFile = jest.fn();
      const outputDir = 'tokens';

      colors.writeCssVariables(createFile, outputDir);

      expect(createFile).toHaveBeenCalledTimes(3);
      expect(createFile).toHaveBeenCalledWith(
        'rgb-color-vars',
        cssTokens.Colors.rgb,
        outputDir,
        'css'
      );
      expect(createFile).toHaveBeenCalledWith(
        'hex-color-vars',
        cssTokens.Colors.hex,
        outputDir,
        'css'
      );
      expect(createFile).toHaveBeenCalledWith(
        'hsl-color-vars',
        cssTokens.Colors.hsl,
        outputDir,
        'css'
      );
    });
  });

  describe('Gradients', () => {
    let gradients: Gradients;
    let figmaFrame: any;

    beforeAll(() => {
      figmaFrame = figmaPage.children.find(
        (figmaFrame: FigmaFrame) => figmaFrame.name === 'Gradients'
      );
      gradients = new Gradients(figmaFrame);
    });

    it('should create Gradients tokens', () => {
      const tokens = gradients.tokens;

      expect(tokens).toBeDefined();
    });

    it('should build tokens', () => {
      const gradientCollection = gradients.tokens.gradients;
      const gradientToken = gradientCollection['radial_generic_dark'];

      expect(gradientToken).toBeDefined();
      expect(gradientToken).toMatchObject({
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

    it('should write css variables', () => {
      const createFile = jest.fn();
      const outputDir = 'tokens';
      const name = 'gradients-vars';

      gradients.writeCssVariables(createFile, outputDir, name);

      expect(createFile).toHaveBeenCalledWith(name, cssTokens.Gradients, outputDir, 'css');
    });
  });

  describe('Shadows', () => {
    let shadows: Shadows;
    let figmaFrame: any;

    beforeAll(() => {
      figmaFrame = figmaPage.children.find(
        (figmaFrame: FigmaFrame) => figmaFrame.name === 'Shadows'
      );
      shadows = new Shadows(figmaFrame);
    });

    it('should create Shadows tokens', () => {
      const tokens = shadows.tokens;

      expect(tokens).toBeDefined();
    });

    it('should build tokens', () => {
      const shadowCollection = shadows.tokens.shadows;
      const shadowToken = shadowCollection['small'];

      expect(shadowToken).toBeDefined();
      expect(shadowToken).toMatchObject([
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

    it('should write css variables', () => {
      const createFile = jest.fn();
      const outputDir = 'tokens';
      const name = 'shadows-vars';

      shadows.writeCssVariables(createFile, outputDir, name);

      expect(createFile).toHaveBeenCalledWith(name, cssTokens.Shadows, outputDir, 'css');
    });
  });

  describe('Spacings', () => {
    let spacings: Spacings;
    let figmaFrame: any;

    beforeAll(() => {
      figmaFrame = figmaPage.children.find(
        (figmaFrame: FigmaFrame) => figmaFrame.name === 'Spacings'
      );
      spacings = new Spacings(figmaFrame);
    });

    it('should create Spacings tokens', () => {
      const tokens = spacings.tokens;

      expect(tokens).toBeDefined();
    });

    it('should build tokens', () => {
      const spacingCollection = spacings.tokens.spacings;
      const spacingToken = spacingCollection['sm'];

      expect(spacingToken).toBeDefined();
      expect(spacingToken).toMatchObject({
        value: '16px',
        remValue: '1rem'
      });
    });

    it('should write tokens', () => {
      const createFile = jest.fn();
      const outputDir = 'tokens';
      const name = 'spacings';

      spacings.writeTokens(createFile, outputDir, name);

      expect(createFile).toHaveBeenCalledWith(name, spacings.tokens, outputDir, 'json');
    });

    it('should write css variables', () => {
      const createFile = jest.fn();
      const outputDir = 'tokens';
      const name = 'spacings-vars';

      spacings.writeCssVariables(createFile, outputDir, name);

      expect(createFile).toHaveBeenCalledWith(name, cssTokens.Spacings, outputDir, 'css');
    });
  });

  describe('Typography', () => {
    let typography: Typographies;
    let figmaFrame: any;

    beforeAll(() => {
      figmaFrame = figmaPage.children.find(
        (figmaFrame: FigmaFrame) => figmaFrame.name === 'Typography'
      );
      typography = new Typographies(figmaFrame);
    });

    it('should create Typography tokens', () => {
      const tokens = typography.tokens;

      expect(tokens).toBeDefined();
    });

    it('should build tokens', () => {
      const typographyCollection = typography.tokens.typography;
      const typographyToken = typographyCollection['mobileTitle1'];

      expect(typographyToken).toBeDefined();
      expect(typographyToken).toMatchObject({
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

    it('should write css variables', () => {
      const createFile = jest.fn();
      const outputDir = 'tokens';
      const name = 'typography-vars';

      typography.writeCssVariables(createFile, outputDir, name);

      expect(createFile).toHaveBeenCalledWith(name, cssTokens.Typographies, outputDir, 'css');
    });
  });
});
