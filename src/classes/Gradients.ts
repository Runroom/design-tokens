import {
  createRootString,
  formatDecimals,
  getTokens,
  gradientDegree,
  parseRgba,
  rgbaGenObject,
  snakeCase
} from '@/functions';
import {
  CreateFile,
  DesignTokensGenerator,
  GradientCollection,
  GradientColor,
  GradientToken,
  GradientTypes
} from '@/types/designTokens';
import { FigmaFrame, FigmaGradientComponent, GradientFills } from '@/types/figma';

export class Gradients implements DesignTokensGenerator {
  readonly tokens: GradientCollection;

  constructor(figmaFrame: FigmaFrame) {
    this.tokens = getTokens<FigmaGradientComponent, GradientCollection, GradientToken>(
      'Gradients',
      figmaFrame,
      this.getGradients
    );
  }

  writeTokens(createFile: CreateFile, outputDir: string, name = 'gradients') {
    return [createFile(name, this.tokens, outputDir, 'json')];
  }

  writeCssVariables(createFile: CreateFile, outputDir: string, name = 'gradients-vars') {
    const { gradientsVars } = this.generateCssGradientsVariables(this.tokens);
    return [createFile(name, gradientsVars, outputDir, 'css')];
  }

  private generateCssGradientsVariables({ gradients }: GradientCollection) {
    let gradientsVars = '';
    const gradientBaseName = '--gradient';

    for (const key in gradients) {
      const gradientName = key.startsWith('gradient') ? `--${key}` : `${gradientBaseName}-${key}`;
      const gradientValue = gradients[key].colors
        .map(({ color, position }) => `${parseRgba(color)} ${position * 100}%`)
        .join(', ');
      gradientsVars = `${gradientsVars}${gradientName}: ${gradients[key].type}(${gradients[key].deg}, ${gradientValue});`;
    }

    return {
      gradientsVars: createRootString(gradientsVars)
    };
  }

  private getGradients(component: FigmaGradientComponent): GradientToken | false {
    if (!(component && component.name)) {
      return false;
    }

    const gradientsTypes: GradientTypes = {
      linear: 'linear-gradient',
      radial: 'radial-gradient'
    };

    const name = snakeCase(component.name);
    let gradient: GradientFills;

    if (component.fills?.length && component.fills[0].type.startsWith('GRADIENT')) {
      gradient = component.fills[0];
    } else if (
      component.children?.length &&
      component.children[0].fills?.length &&
      component.children[0].fills[0].type.startsWith('GRADIENT')
    ) {
      gradient = component.children[0].fills[0];
    } else {
      return false;
    }

    const gradientType =
      gradientsTypes[gradient.type.split('_')[1].toLowerCase() as keyof typeof gradientsTypes];

    const gradientAngle =
      gradientType === gradientsTypes.radial
        ? 'circle'
        : gradientDegree(gradient.gradientHandlePositions[0], gradient.gradientHandlePositions[1]);

    const gradientColors: GradientColor[] = gradient.gradientStops.map(({ color, position }) => {
      const { r, g, b, a } = color;
      return {
        color: rgbaGenObject(r, g, b, a),
        position: formatDecimals(position)
      };
    });

    return {
      [name]: {
        type: gradientType,
        deg: gradientAngle,
        colors: gradientColors
      }
    };
  }
}
