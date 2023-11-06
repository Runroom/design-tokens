import {
  Breakpoints,
  Colors,
  Shadows,
  Spacings,
  Borders,
  Typographies,
  Gradients
} from '@/classes';

const DESIGN_TOKENS = {
  Colors: Colors,
  Typography: Typographies,
  Spacings: Spacings,
  Breakpoints: Breakpoints,
  Borders: Borders,
  Shadows: Shadows,
  Gradients: Gradients
} as const;

type DesignPages = keyof typeof DESIGN_TOKENS;

export { DESIGN_TOKENS, DesignPages };
