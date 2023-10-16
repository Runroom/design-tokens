import { GenerateTokens } from '@/types/Token.ts';
import { promises as fsp } from 'fs';

const createFile = (name: string, payload: GenerateTokens | string, outDir: string, ext = 'json') =>
  fsp.writeFile(
    `${outDir}/${name}.${ext}`,
    JSON.stringify(payload, null, 2).replace(/^"(.+(?="$))"$/, '$1')
  );

export { createFile };
