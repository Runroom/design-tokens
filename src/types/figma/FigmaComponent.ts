import {
  AbsoluteBoundingBoxOrAbsoluteRenderBounds,
  Constraints,
  FigmaColor,
  FillsEntityOrBackgroundEntity,
  Style
} from '@/types/figma/Figma.ts';

export interface FigmaComponent {
  name: string;
  type: 'COMPONENT' | 'INSTANCE';
  children?: FigmaComponentToken[];
}

export interface FigmaBaseToken {
  id: string;
  name: string;
  type: string;
  scrollBehavior: string;
  blendMode: string;
  absoluteBoundingBox: AbsoluteBoundingBoxOrAbsoluteRenderBounds;
  absoluteRenderBounds: AbsoluteBoundingBoxOrAbsoluteRenderBounds;
  constraints: Constraints;
  strokes?: FillsEntityOrBackgroundEntity[];
  strokeWeight: number;
  strokeAlign: string;
  effects: unknown[];
}

export interface FigmaComponentToken extends FigmaBaseToken {
  children?: unknown[];
  layoutAlign?: string;
  layoutGrow?: number;
  layoutSizingHorizontal?: string;
  layoutSizingVertical?: string;
  clipsContent?: boolean;
  background?: unknown[];
  rectangleCornerRadii?: number[];
  cornerSmoothing?: number;
  backgroundColor?: FigmaColor;
  characters?: string;
  style?: Style;
  characterStyleOverrides?: unknown[];
  styleOverrideTable?: unknown;
  lineTypes?: string[];
  lineIndentations?: number[];
  styles?: unknown[];
}
