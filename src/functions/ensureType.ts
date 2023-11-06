import { FigmaResponse } from '@/types/figma';
import { DESIGN_TOKENS, DesignPages } from '@/designTokensPages.ts';

export const isFigmaResponse = (response: unknown): response is FigmaResponse => {
  if (typeof response !== 'object') {
    return false;
  }

  if (!((response as FigmaResponse).document || (response as FigmaResponse).document.children)) {
    return false;
  }

  return true;
};

export const validateFrameName = (name: string): name is DesignPages =>
  Object.keys(DESIGN_TOKENS).includes(name);
