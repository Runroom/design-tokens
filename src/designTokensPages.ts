import { Breakpoints, Colors, Spacings, Typographies } from '@/classes';
import { DesignTokensPages } from '@/types/designTokens';

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
  }
];

export { designTokensPages };
