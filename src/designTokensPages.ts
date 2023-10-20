import { Breakpoints, Colors, Spacings, Typographies } from '@/classes';
import { DesignTokensPages } from '@/types/designTokens';
import { Borders } from '@/classes/Borders.ts';

const designTokensPages: DesignTokensPages[] = [
  {
    name: 'Colors',
    class: Colors
  },
  {
    name: 'Typography',
    class: Typographies
  },
  {
    name: 'Spacings',
    class: Spacings
  },
  {
    name: 'Breakpoints',
    class: Breakpoints
  },
  {
    name: 'Borders',
    class: Borders
  }
];

export { designTokensPages };
