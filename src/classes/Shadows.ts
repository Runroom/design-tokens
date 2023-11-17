import {
  CreateFile,
  DesignTokensGenerator,
  ShadowCollection,
  ShadowToken,
  TokenPayload
} from '@/types/designTokens';
import { FigmaShadowComponent } from '@/types/figma';
import { createRootString, getTokens, rgbaGen, snakeCase } from '@/functions';

const generateCssShadowVariables = ({ shadows }: ShadowCollection) => {
  let shadowsVars = '';
  const shadowBaseName = '--shadow';
  const shadowFilterBaseName = '--shadow-drop-filter';

  for (const name in shadows) {
    const shadowName = `${shadowBaseName}-${snakeCase(name)}`;
    const shadowFilterName = `${shadowFilterBaseName}-${snakeCase(name)}`;
    let shadowValue = '';
    let shadowFilterValue = '';

    for (const index in shadows[name]) {
      const { color, offset, radius } = shadows[name][index];
      const { r, g, b, a } = color;
      const rgba = rgbaGen(r, g, b, a);
      const offsetString = `${offset.x}px ${offset.y}px`;
      const radiusString = `${radius}px`;
      shadowValue = `${shadowValue}${offsetString} ${radiusString} ${rgba}`;
      shadowFilterValue = `${shadowFilterValue}drop-shadow(${offsetString} ${radiusString} ${rgba})`;

      if (Number(index) < shadows[name].length - 1) {
        shadowValue = `${shadowValue}, `;
        shadowFilterValue = `${shadowFilterValue} `;
      }
    }
    shadowsVars = `${shadowsVars}${shadowName}: ${shadowValue};`;
    shadowsVars = `${shadowsVars}${shadowFilterName}: ${shadowFilterValue};`;
  }

  return {
    shadowsVars: createRootString(shadowsVars)
  };
};

const getShadowsEffects = (component: FigmaShadowComponent): ShadowToken | false => {
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
    [name]: effects
  };
};

const writeShadowTokens =
  (tokens: ShadowCollection) =>
  (createFile: CreateFile, outputDir: string, name = 'shadows') => {
    return [createFile(name, tokens, outputDir, 'json')];
  };

const writeShadowVariables =
  (tokens: ShadowCollection) =>
  (createFile: CreateFile, outputDir: string, name = 'shadows-vars') => {
    const { shadowsVars } = generateCssShadowVariables(tokens);

    return [createFile(name, shadowsVars, outputDir, 'css')];
  };

const Shadows = ({ frame }: TokenPayload): DesignTokensGenerator => {
  const tokens = getTokens<FigmaShadowComponent, ShadowCollection, ShadowToken>(
    'Shadows',
    frame,
    getShadowsEffects
  );

  return {
    name: 'Shadows',
    tokens,
    writeTokens: writeShadowTokens(tokens),
    writeCssVariables: writeShadowVariables(tokens)
  };
};

export { Shadows };
