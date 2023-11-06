import { FigmaComponent, FigmaComponentToken } from '@/types/figma/FigmaComponent.ts';

export interface FigmaBorderComponent extends FigmaComponent {
  children?: FigmaBorderToken[];
  cornerRadius?: number;
}

export interface FigmaBorderToken extends FigmaComponentToken {
  clipsContent: boolean;
  componentId: string;
  overrides?: unknown[];
  cornerRadius: number;
}
