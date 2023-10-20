import { CreateFile, ShadowCollection, ShadowToken } from '@/types/designTokens';
import { FigmaFrame, FigmaShadowComponent } from '@/types/figma';
import { DesignTokens } from './DesignTokens.ts';
import { createRootString, getTokens, rgbaGen, snakeCase } from '@/functions';

export class Shadows extends DesignTokens<ShadowCollection> {
  constructor(figmaFrame: FigmaFrame) {
    const tokens = getTokens<FigmaShadowComponent, ShadowCollection, ShadowToken>(
      'Shadows',
      figmaFrame,
      Shadows.getShadowsEffects
    );

    super(tokens);
  }

  writeTokens(createFile: CreateFile, outputDir: string, name = 'shadows') {
    return [createFile(name, this.tokens, outputDir, 'json')];
  }

  writeCssVariables(createFile: CreateFile, outputDir: string, name = 'shadows-vars') {
    const { shadowsVars } = this.generateCssShadowVariables(this.tokens);

    return [createFile(name, shadowsVars, outputDir, 'css')];
  }

  private generateCssShadowVariables({ shadows }: ShadowCollection) {
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
  }

  static getShadowsEffects(component: FigmaShadowComponent): ShadowToken | false {
    if (!(component && component.name)) {
      return false;
    }

    const shadowEffects = component.effects.filter(
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
  }
}
