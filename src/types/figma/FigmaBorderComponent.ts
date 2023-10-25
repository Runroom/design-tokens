import { FigmaComponent, FigmaComponentToken } from '@/types/figma/FigmaComponent.ts';
import {
  AbsoluteBoundingBoxOrAbsoluteRenderBounds,
  Constraints,
  FigmaColor,
  FillsEntityOrBackgroundEntity
} from '@/types/figma/Figma.ts';

export interface FigmaBorderComponent extends FigmaComponent {
  id: string;
  name: string;
  type: string;
  scrollBehavior: string;
  blendMode: string;
  children?: FigmaBorderToken[];
  absoluteBoundingBox: AbsoluteBoundingBoxOrAbsoluteRenderBounds;
  absoluteRenderBounds: AbsoluteBoundingBoxOrAbsoluteRenderBounds;
  constraints: Constraints;
  layoutAlign: string;
  layoutGrow: number;
  layoutSizingHorizontal: string;
  layoutSizingVertical: string;
  clipsContent: boolean;
  background?: FillsEntityOrBackgroundEntity[];
  fills?: FillsEntityOrBackgroundEntity[];
  strokes?: null[];
  strokeWeight: number;
  strokeAlign: string;
  backgroundColor: FigmaColor;
  effects?: null[];
  cornerRadius?: number;
}

export interface FigmaBorderToken extends FigmaComponentToken {
  clipsContent: boolean;
  componentId: string;
  overrides?: unknown[];
  cornerRadius: number;
}
