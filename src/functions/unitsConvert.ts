import { FigmaOffset } from '@/types/figma';

const REM_BASE = 16;

const formatNumber = (n: string | number) => parseFloat(parseFloat(String(n)).toFixed(5));
const pixelate = (value: number) => `${Math.floor(value)}px`;
const remify = (value: number) => `${formatNumber(value / REM_BASE)}rem`;

const calculateAngleBetweenTwoPoints = (point1: FigmaOffset, point2: FigmaOffset) =>
  Math.round((Math.atan2(point2.y - point1.y, point2.x - point1.x) * 180) / Math.PI);

const getDegrees = (angle: number) => (angle < 0 ? 360 + angle : angle);

const gradientDegree = (point1: FigmaOffset, point2: FigmaOffset): `${string}deg` => {
  const angle = calculateAngleBetweenTwoPoints(point1, point2);
  return `${getDegrees(angle)}deg`;
};

const formatDecimals = (number: number) => {
  const decimals = number.toString().split('.')[1];
  const fixed = Number(number.toFixed(2));
  return decimals && decimals.length > 2 ? fixed : number;
};

export { formatNumber, pixelate, remify, gradientDegree, formatDecimals };
