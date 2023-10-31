import fetchMock from './mocks/fetchMock';
import { designTokensBuilder, getFigmaFrame } from '../src/functions';
import { Colors, Spacings, Typographies } from '../src/classes';

const FILE_ID = 'file-id';
const TOKEN = 'api-token-fake';
const FETCH_URL = `https://api.figma.com/v1/files/${FILE_ID}`;

const FETCH_DATA = {
  method: 'GET',
  headers: {
    'X-Figma-Token': TOKEN
  }
};
const PAGE_NAME = '🔄 Design Tokens';

describe('Figma connection', () => {
  let figmaJson: any;
  let figmaTree: any;
  let figmaFrame: any;

  beforeAll(async () => {
    await fetchMock(FETCH_URL, FETCH_DATA).then(response => {
      figmaJson = response;
      figmaTree = response.json();
      figmaTree = figmaTree.document.children;
      figmaFrame = getFigmaFrame(figmaTree, PAGE_NAME);
    });
  });

  describe('Json fetching', () => {
    it(`Project with ID ${FILE_ID} exists`, () => {
      expect(figmaJson.status).not.toBe(403);
      expect(figmaJson.status).not.toBe(404);
    });

    it(`Page ${PAGE_NAME} exists`, () => {
      expect(figmaTree.length > 0).toBeTruthy();
    });
  });

  describe('Json parsing', () => {
    describe('Frames', () => {
      it('should no frame', () => {
        const noFigmaFrame = getFigmaFrame(figmaTree, 'FakeFrame');

        expect(noFigmaFrame).toBeFalsy();
      });

      it('should find frame', () => {
        const figmaFrame = getFigmaFrame(figmaTree, PAGE_NAME);

        expect(figmaFrame).toBeTruthy();
      });
    });

    describe('Color parser', () => {
      let colors: any;
      let tokens: any;
      let hexColor: any;
      let rgbColor: any;
      let hslColor: any;

      beforeAll(() => {
        colors = designTokensBuilder('Colors', ['Colors'], figmaFrame, Colors);
        tokens = colors?.tokens;
        hexColor = tokens['colors'][Object.keys(tokens['colors'])[0]].hexColor;
        rgbColor = tokens['colors'][Object.keys(tokens['colors'])[0]].rgbColor;
        hslColor = tokens['colors'][Object.keys(tokens['colors'])[0]].hslColor;
      });

      it('should build Colors design tokens', () => {
        expect(colors).toBeInstanceOf(Colors);
      });

      it('tokens is object', () => {
        expect(tokens).toBeInstanceOf(Object);
        expect(tokens['colors']).toBeInstanceOf(Object);
        expect(Object.keys(tokens['colors']).length).toBeGreaterThan(0);
      });

      it('Hex value is valid', () => {
        expect(typeof hexColor).toBe('string');
        expect(/#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})/i.test(hexColor)).toBe(true);
      });

      it('RGB value to be an object', () => {
        expect(typeof rgbColor).toBe('object');
      });

      it('HSL value to be an array of decimals', () => {
        expect(typeof hslColor).toBe('object');
        expect(hslColor.h).toBeGreaterThanOrEqual(0);
        expect(hslColor.h).toBeLessThanOrEqual(360);
        expect(hslColor.s).toBeGreaterThanOrEqual(0);
        expect(hslColor.a).toBeLessThanOrEqual(1);
      });
    });

    describe('Spacings parser', () => {
      let spacings: any;
      let tokens: any;
      let spacing: any;

      beforeAll(() => {
        spacings = designTokensBuilder('Spacings', ['Spacings'], figmaFrame, Spacings);
        tokens = spacings?.tokens;
        spacing = tokens['spacings'][Object.keys(tokens['spacings'])[0]].value;
      });

      it('should build Spacings design tokens', () => {
        expect(spacings).toBeInstanceOf(Spacings);
      });
      it('tokens is object', () => {
        expect(tokens).toBeInstanceOf(Object);
        expect(tokens['spacings']).toBeInstanceOf(Object);
      });
      it('value is string', () => {
        expect(typeof spacing).toBe('string');
      });
      it('value is pixelated', () => {
        expect(/([0-9]+)px/.test(spacing)).toBe(true);
      });
    });
  });

  describe('Typography parser', () => {
    let typographies: any;
    let tokens: any;
    let text: any;

    beforeAll(() => {
      typographies = designTokensBuilder('Typography', ['Typography'], figmaFrame, Typographies);
      tokens = typographies?.tokens;
      text = tokens['typography'][Object.keys(tokens['typography'])[0]];
    });

    it('should build Typographies design tokens', () => {
      expect(typographies).toBeInstanceOf(Typographies);
    });

    it('tokens is object', () => {
      expect(tokens).toBeInstanceOf(Object);
      expect(tokens['typography']).toBeInstanceOf(Object);
    });

    it('has correct props', () => {
      expect(text.fontFamily).toBeDefined();
      expect(text.fontSize).toBeDefined();
      expect(text.fontWeight).toBeDefined();
      expect(text.letterSpacing).toBeDefined();
      expect(text.lineHeight).toBeDefined();
    });

    it('props have valid types', () => {
      expect(typeof text.fontFamily).toBe('string');
      expect(typeof text.fontSize).toBe('string');
      expect(typeof text.fontWeight).toBe('number');
      expect(typeof text.lineHeight).toBe('number');
    });
  });
});
