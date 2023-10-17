import { HslColor, RgbColor } from '@/types/designTokens';

const HEX_BASE = 16;

const getColor = (color: number) => Math.round(color * 255);

const rgbaGen = (r: number, g: number, b: number, a = 1) =>
  `rgb(${getColor(r)} ${getColor(g)} ${getColor(b)} / ${a})`;

const rgbaGenObject = (r: number, g: number, b: number, a = 1) => ({
  r: getColor(r),
  g: getColor(g),
  b: getColor(b),
  a: a
});

const rgbToHex = (c: number) => {
  const hex = Number(c).toString(HEX_BASE);
  return hex.length < 2 ? `0${hex}` : hex;
};

const fullColorHex = (r: number, g: number, b: number) => {
  const red = rgbToHex(r);
  const green = rgbToHex(g);
  const blue = rgbToHex(b);

  const redReduced = [...new Set(red.split(''))].join('');
  const greenReduced = [...new Set(green.split(''))].join('');
  const blueReduced = [...new Set(blue.split(''))].join('');

  if (redReduced.length === 1 && greenReduced.length === 1 && blueReduced.length === 1) {
    return `#${redReduced + greenReduced + blueReduced}`.toLocaleLowerCase();
  }

  return `#${red + green + blue}`.toLocaleLowerCase();
};

const fullColorHsl = (r: number, g: number, b: number, a = 1): HslColor => {
  const red = Math.min(255, Math.max(0, r));
  const green = Math.min(255, Math.max(0, g));
  const blue = Math.min(255, Math.max(0, b));
  const alpha = Math.min(100, Math.max(0, a));

  const redNormalized = red / 255;
  const greenNormalized = green / 255;
  const blueNormalized = blue / 255;

  const max = Math.max(redNormalized, greenNormalized, blueNormalized);
  const min = Math.min(redNormalized, greenNormalized, blueNormalized);

  const lightness = (max + min) / 2;

  let hue = 0;
  let saturation = 0;

  if (max !== min) {
    const delta = max - min;

    saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);

    switch (max) {
      case redNormalized:
        hue =
          ((greenNormalized - blueNormalized) / delta +
            (greenNormalized < blueNormalized ? 6 : 0)) *
          60;
        break;
      case greenNormalized:
        hue = ((blueNormalized - redNormalized) / delta + 2) * 60;
        break;
      case blueNormalized:
        hue = ((redNormalized - greenNormalized) / delta + 4) * 60;
        break;
    }
  }

  return {
    h: Math.round(hue),
    s: Math.round(saturation * 100),
    l: Math.round(lightness * 100),
    a: alpha
  };
};

const parseRgba = (color: RgbColor) => {
  const { r, g, b, a = 1 } = color;
  return `rgb(${r} ${g} ${b} / ${a})`;
};

export { getColor, rgbaGen, rgbaGenObject, rgbToHex, fullColorHex, fullColorHsl, parseRgba };
