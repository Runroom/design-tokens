import fetchMock from './mocks/fetchMock';

import { getColors, getSpacings, getTypography } from '../src/functions/tokensParser.ts';

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

  beforeAll(async () => {
    await fetchMock(FETCH_URL, FETCH_DATA).then(response => {
      figmaJson = response;
      figmaTree = response.json();
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
    describe('Tokens parser', () => {
      it('should no art board', () => {
        const noArtBoard = filterArtBoards('ArtBoard', figmaTree[0].children);

        expect(noArtBoard.length).toBe(0);
      });
    });

    describe('Color parser', () => {
      let colors: any;
      let tokens: any;
      let hexColor: any;
      let rgbColor: any;
      let hslColor: any;

      beforeAll(() => {
        tokens = generateTokens('Colors', figmaTree[0].children, getColors);
        colors = filterArtBoards('Colors', figmaTree[0].children);
        hexColor = tokens['colors'][Object.keys(tokens['colors'])[0]].hexColor;
        rgbColor = tokens['colors'][Object.keys(tokens['colors'])[0]].rgbColor;
        hslColor = tokens['colors'][Object.keys(tokens['colors'])[0]].hslColor;
      });

      it('filtered artboard is array', () => {
        expect(Array.isArray(colors)).toBe(true);
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
        tokens = generateTokens('Spacings', figmaTree[0].children, getSpacings);
        spacings = filterArtBoards('Spacings', figmaTree[0].children);
        spacing = tokens['spacings'][Object.keys(tokens['spacings'])[0]].value;
      });

      it('filtered artboard is array', () => {
        expect(Array.isArray(spacings)).toBe(true);
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
    let typography: any;
    let tokens: any;
    let text: any;

    beforeAll(() => {
      tokens = generateTokens('Typography', figmaTree[0].children, getTypography);
      typography = filterArtBoards('Typography', figmaTree[0].children);
      text = tokens['typography'][Object.keys(tokens['typography'])[0]];
    });

    it('filtered artboard is array', () => {
      expect(Array.isArray(typography)).toBe(true);
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
