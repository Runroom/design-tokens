import { FigmaComponent, FigmaComponentToken } from '@/types/figma/FigmaComponent.ts';
import {
  AbsoluteBoundingBoxOrAbsoluteRenderBounds,
  Constraints,
  FigmaColor,
  FillsEntityOrBackgroundEntity
} from '@/types/figma/Figma.ts';

export interface FigmaBreakPointComponent extends FigmaComponent {
  id: string;
  name: string;
  scrollBehavior: string;
  blendMode: string;
  children?: FigmaBreakPointToken[];
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

export interface FigmaBreakPointToken extends FigmaComponentToken {
  clipsContent: boolean;
  componentId: string;
  overrides?: unknown[];
}
