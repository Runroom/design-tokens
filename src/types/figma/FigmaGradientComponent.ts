import { FigmaComponent, FigmaComponentToken } from '@/types/figma/FigmaComponent.ts';
import {
  AbsoluteBoundingBoxOrAbsoluteRenderBounds,
  Constraints,
  FigmaColor,
  GradientFills
} from '@/types/figma/Figma.ts';

export interface FigmaGradientComponent extends FigmaComponent {
  id: string;
  name: string;
  scrollBehavior: string;
  blendMode: string;
  children?: FigmaGradientToken[];
  absoluteBoundingBox: AbsoluteBoundingBoxOrAbsoluteRenderBounds;
  absoluteRenderBounds: AbsoluteBoundingBoxOrAbsoluteRenderBounds;
  constraints: Constraints;
  layoutAlign: string;
  layoutGrow: number;
  layoutSizingHorizontal: string;
  layoutSizingVertical: string;
  clipsContent: boolean;
  background?: GradientFills[];
  fills?: GradientFills[];
  strokes?: null[];
  strokeWeight: number;
  strokeAlign: string;
  backgroundColor: FigmaColor;
  effects?: null[];
  cornerRadius?: number;
}

export interface FigmaGradientToken extends FigmaComponentToken {
  clipsContent: boolean;
  componentId: string;
  overrides?: unknown[];
  cornerRadius: number;
  fills?: GradientFills[];
}
