import { Breakpoints, Colors, Shadows, Spacings, Borders, Typographies } from '@/classes';
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
  },
  {
    name: 'Borders',
    class: Borders
  },
  {
    name: 'Shadows',
    class: Shadows
  }
];

export { designTokensPages };
