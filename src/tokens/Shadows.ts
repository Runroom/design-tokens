import {
  CreateFile,
  DesignTokensGenerator,
  Shadow,
  ShadowCollection,
  ShadowToken,
  TokenPayload
} from '@/types/designTokens';
import { FigmaShadowComponent } from '@/types/figma';
import { getTokens, rgbaGen, snakeCase } from '@/functions';
import { DesignTokens } from 'style-dictionary/types/DesignToken';
import { Parser } from 'style-dictionary/types/Parser';

const SHADOWS_NAME = 'shadows';

const getShadows = (component: FigmaShadowComponent): ShadowToken | false => {
  if (!(component && component.name)) {
    return false;
  }

  const figmaShadows = component.effects.length ? component.effects : component.children[0].effects;

  if (!figmaShadows) {
    return false;
  }

  const shadowEffects = figmaShadows.filter(
    effect => effect.type === 'DROP_SHADOW' && effect.visible
  );

  if (!shadowEffects.length) {
    return false;
  }

  const name = snakeCase(component.name);
  const effects = shadowEffects.map(effect => {
    return {
      color: effect.color,
      offset: effect.offset,
      radius: effect.radius
    };
  });

  return {
    [name]: {
      value: effects
    }
  };
};

const writeShadowTokens =
  (tokens: ShadowCollection) =>
  (createFile: CreateFile, outputDir: string, name = SHADOWS_NAME) => {
    return [createFile(name, tokens, outputDir, 'json')];
  };

const buildShadow = (shadow: Shadow[]) => {
  let formattedShadow = '';
  let formattedDropShadow = '';

  for (const index in shadow) {
    const { color, offset, radius } = shadow[index];
    const { r, g, b, a } = color;
    const rgba = rgbaGen(r, g, b, a);
    const offsetString = `${offset.x}px ${offset.y}px`;
    const radiusString = `${radius}px`;
    formattedShadow = `${formattedShadow}${offsetString} ${radiusString} ${rgba}`;
    formattedDropShadow = `${formattedDropShadow}drop-shadow(${offsetString} ${radiusString} ${rgba})`;
  }

  return {
    formattedShadow,
    formattedDropShadow
  };
};

const getShadowsParser = (): Parser => {
  const pattern = new RegExp(`${SHADOWS_NAME}.json$`);

  return {
    pattern,
    parse: ({ contents }) => {
      const { shadows } = JSON.parse(contents);
      const output: DesignTokens = {};

      Object.keys(shadows).forEach(key => {
        const shadow: Shadow[] = shadows[key].value;
        const { formattedShadow, formattedDropShadow } = buildShadow(shadow);

        output[`shadow-drop-filter-${key}`] = {
          value: formattedDropShadow
        };

        output[`shadow-${key}`] = {
          value: formattedShadow
        };
      });

      return output;
    }
  };
};

const Shadows = ({ frame }: TokenPayload): DesignTokensGenerator => {
  const tokens = getTokens<FigmaShadowComponent, ShadowCollection, ShadowToken>(
    'Shadows',
    frame,
    getShadows
  );

  return {
    name: 'Shadows',
    tokens,
    writeTokens: writeShadowTokens(tokens)
  };
};

export { Shadows, getShadowsParser };
