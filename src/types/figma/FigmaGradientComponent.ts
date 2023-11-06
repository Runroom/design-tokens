import { FigmaComponent, FigmaComponentToken } from '@/types/figma/FigmaComponent.ts';
import { GradientFills } from '@/types/figma/Figma.ts';

export interface FigmaGradientComponent extends FigmaComponent {
  background?: GradientFills[];
  fills?: GradientFills[];
  children?: FigmaGradientToken[];
}

export interface FigmaGradientToken extends FigmaComponentToken {
  fills?: GradientFills[];
}
