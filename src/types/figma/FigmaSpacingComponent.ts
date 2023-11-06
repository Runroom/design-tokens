import { FigmaComponent, FigmaComponentToken } from '@/types/figma/FigmaComponent.ts';
import { AbsoluteBoundingBoxOrAbsoluteRenderBounds } from '@/types/figma/Figma.ts';

export interface FigmaSpacingComponent extends FigmaComponent {
  children?: FigmaSpacingToken[];
  absoluteBoundingBox: AbsoluteBoundingBoxOrAbsoluteRenderBounds;
  absoluteRenderBounds: AbsoluteBoundingBoxOrAbsoluteRenderBounds;
}

export interface FigmaSpacingToken extends FigmaComponentToken {
  absoluteBoundingBox: AbsoluteBoundingBoxOrAbsoluteRenderBounds;
  absoluteRenderBounds: AbsoluteBoundingBoxOrAbsoluteRenderBounds;
}
