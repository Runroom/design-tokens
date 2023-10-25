import {
  AbsoluteBoundingBoxOrAbsoluteRenderBounds,
  Constraints,
  FigmaColor,
  FillsEntityOrBackgroundEntity,
  Style
} from '@/types/figma/Figma.ts';

export interface FigmaComponent {
  id: string;
  name: string;
  type: 'COMPONENT' | 'INSTANCE';
  scrollBehavior: string;
  blendMode: string;
  children?: FigmaComponentToken[];
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
  strokes?: unknown[];
  strokeWeight: number;
  strokeAlign: string;
  backgroundColor: FigmaColor;
  layoutMode?: string;
  counterAxisSizingMode?: string;
  itemSpacing?: number;
  layoutWrap?: string;
  effects?: unknown[];
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
  fills?: FillsEntityOrBackgroundEntity[];
  strokes?: FillsEntityOrBackgroundEntity[];
  strokeWeight: number;
  strokeAlign: string;
  effects?: null[];
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
