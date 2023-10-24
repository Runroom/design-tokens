import { FigmaComponent, FigmaComponentToken } from '@/types/figma/FigmaComponent';
import {
  AbsoluteBoundingBoxOrAbsoluteRenderBounds,
  Constraints,
  FigmaColor,
  FillsEntityOrBackgroundEntity,
  Style
} from '@/types/figma/Figma.ts';

export interface FigmaTypographyComponent extends FigmaComponent {
  id: string;
  name: string;
  scrollBehavior: string;
  blendMode: string;
  children?: FigmaTypographyToken[];
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
}

export interface FigmaTypographyToken extends FigmaComponentToken {
  characters: string;
  style: Style;
  characterStyleOverrides?: null[];
  styleOverrideTable: unknown;
  lineTypes?: string[];
  lineIndentations?: number[];
}
