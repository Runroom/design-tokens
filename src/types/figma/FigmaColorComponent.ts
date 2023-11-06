import { FigmaComponent, FigmaComponentToken } from '@/types/figma/FigmaComponent.ts';
import { FillsEntityOrBackgroundEntity } from '@/types/figma/Figma.ts';

export interface FigmaColorComponent extends FigmaComponent {
  fills?: FillsEntityOrBackgroundEntity[];
  children?: FigmaColorToken[];
}

export interface FigmaColorToken extends FigmaComponentToken {
  styles: unknown[];
  fills?: FillsEntityOrBackgroundEntity[];
}
