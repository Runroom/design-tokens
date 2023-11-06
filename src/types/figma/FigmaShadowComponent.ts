import { FigmaComponent, FigmaComponentToken } from '@/types/figma/FigmaComponent.ts';
import { FigmaColor, FigmaOffset } from '@/types/figma/Figma.ts';

export interface FigmaShadowComponent extends FigmaComponent {
  children: FigmaShadowToken[];
  effects: FigmaEffects[];
}

export interface FigmaShadowToken extends FigmaComponentToken {
  effects: FigmaEffects[];
}

export interface FigmaEffects {
  type: string;
  visible: boolean;
  color: FigmaColor;
  blendMode: string;
  offset: FigmaOffset;
  radius: number;
  showShadowBehindNode: boolean;
}
