import { FigmaComponent } from '@/types/figma/FigmaComponent.ts';

export type FigmaResponse = {
  document: FigmaDocument;
  components: FigmaComponents;
  componentSets: FigmaComponentSets;
  schemaVersion: number;
  styles: FigmaStyles;
  name: string;
  lastModified: string;
  thumbnailUrl: string;
  version: string;
  role: string;
  editorType: string;
  linkAccess: string;
  status: number;
};

export type FigmaDocument = {
  id: string;
  name: string;
  type: string;
  scrollBehavior: string;
  children: FigmaPage[];
};

export type FigmaComponents = {
  key: string;
  name: string;
  description: string;
  remote: boolean;
  documentationLinks?: null[];
};

export type FigmaComponentSets = {};

export type FigmaStyles = {
  key: string;
  name: string;
  styleType: string;
  remote: boolean;
  description: string;
};

export type FigmaPage = {
  id: string;
  name: string;
  type: string;
  scrollBehavior: string;
  children?: FigmaFrame[];
  backgroundColor: FigmaColor;
  prototypeStartNodeID?: null;
  flowStartingPoints?: null[];
  prototypeDevice: PrototypeDevice;
};

export type FigmaFrame = {
  id: string;
  name: string;
  type: 'FRAME';
  scrollBehavior: string;
  blendMode: string;
  children?: (FigmaComponent | FigmaFrame)[];
  absoluteBoundingBox: AbsoluteBoundingBoxOrAbsoluteRenderBounds;
  absoluteRenderBounds: AbsoluteBoundingBoxOrAbsoluteRenderBounds;
  constraints: Constraints;
  layoutSizingHorizontal: string;
  layoutSizingVertical: string;
  clipsContent: boolean;
  background?: FillsEntityOrBackgroundEntity[];
  fills?: FillsEntityOrBackgroundEntity[];
  strokes?: unknown[];
  strokeWeight: number;
  strokeAlign: string;
  backgroundColor: FigmaColor;
  layoutMode: string;
  counterAxisSizingMode: string;
  itemSpacing: number;
  paddingLeft: number;
  paddingRight: number;
  paddingTop: number;
  paddingBottom: number;
  layoutWrap: string;
  exportSettings?: ExportSettingsEntity[];
  effects?: unknown[];
};

export type Style = {
  fontFamily: string;
  fontPostScriptName: string;
  fontWeight: number;
  textAutoResize: string;
  fontSize: number;
  textAlignHorizontal: string;
  textAlignVertical: string;
  letterSpacing: number;
  lineHeightPx: number;
  lineHeightPercent: number;
  lineHeightUnit: string;
  paragraphSpacing: number;
  lineHeightPercentFontSize: number;
  textCase?: string;
};

export type ExportSettingsEntity = {
  suffix: string;
  format: string;
  constraint: Constraint;
};

export type Constraint = {
  type: string;
  value: number;
};

export type PrototypeDevice = {
  type: string;
  rotation: string;
};

export type AbsoluteBoundingBoxOrAbsoluteRenderBounds = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type Constraints = {
  vertical: string;
  horizontal: string;
};

export type FillsEntityOrBackgroundEntity = {
  blendMode: string;
  visible?: boolean;
  type: string;
  color: FigmaColor;
};

export type FigmaColor = {
  r: number;
  g: number;
  b: number;
  a: number;
};
