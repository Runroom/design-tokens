const REM_BASE = 16;

const formatNumber = (n: string | number) => parseFloat(parseFloat(String(n)).toFixed(5));

const pixelate = (value: number) => `${Math.floor(value)}px`;

const remify = (value: number) => `${formatNumber(value / REM_BASE)}rem`;

export { formatNumber, pixelate, remify };
