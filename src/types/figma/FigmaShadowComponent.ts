import { FigmaComponent, FigmaComponentToken } from '@/types/figma/FigmaComponent.ts';
import {
  AbsoluteBoundingBoxOrAbsoluteRenderBounds,
  Constraints,
  FigmaColor,
  FigmaOffset,
  FillsEntityOrBackgroundEntity
} from '@/types/figma/Figma.ts';

export interface FigmaShadowComponent extends FigmaComponent {
  id: string;
  name: string;
  scrollBehavior: string;
  blendMode: string;
  children?: FigmaShadowToken[];
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
  effects: FigmaEffects[];
}

export interface FigmaShadowToken extends FigmaComponentToken {
  clipsContent: boolean;
  componentId: string;
  overrides?: unknown[];
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
