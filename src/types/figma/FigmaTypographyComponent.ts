import { FigmaComponent, FigmaComponentToken } from '@/types/figma/FigmaComponent';
import { Style } from '@/types/figma/Figma.ts';

export interface FigmaTypographyComponent extends FigmaComponent {
  children?: FigmaTypographyToken[];
}

export interface FigmaTypographyToken extends FigmaComponentToken {
  style: Style;
}
