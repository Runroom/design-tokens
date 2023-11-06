import { FigmaComponent, FigmaComponentToken } from '@/types/figma/FigmaComponent.ts';
import { AbsoluteBoundingBoxOrAbsoluteRenderBounds } from '@/types/figma/Figma.ts';

export interface FigmaBreakPointComponent extends FigmaComponent {
  absoluteBoundingBox: AbsoluteBoundingBoxOrAbsoluteRenderBounds;
  absoluteRenderBounds: AbsoluteBoundingBoxOrAbsoluteRenderBounds;
  children?: FigmaBreakPointToken[];
}

export interface FigmaBreakPointToken extends FigmaComponentToken {
  absoluteBoundingBox: AbsoluteBoundingBoxOrAbsoluteRenderBounds;
  absoluteRenderBounds: AbsoluteBoundingBoxOrAbsoluteRenderBounds;
}
