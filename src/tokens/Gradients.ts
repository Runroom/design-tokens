import {
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
  Gradient,
  GradientCollection,
  GradientColor,
  GradientToken,
  GradientTypes,
  TokenPayload
} from '@/types/designTokens';
import { FigmaGradientComponent, GradientFills } from '@/types/figma';
import { DesignTokens } from 'style-dictionary/types/DesignToken';
import { Parser } from 'style-dictionary/types/Parser';

const GRADIENTS_NAME = 'gradients';
const GRADIENT_TYPE = 'gradient';

const getGradients = (component: FigmaGradientComponent): GradientToken | false => {
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
      name,
      type: GRADIENT_TYPE,
      value: {
        type: gradientType,
        deg: gradientAngle,
        colors: gradientColors
      }
    }
  };
};

const writeGradientTokens =
  (tokens: GradientCollection) =>
  (createFile: CreateFile, outputDir: string, name = GRADIENTS_NAME) => {
    return [createFile(name, tokens, outputDir, 'json')];
  };

const buildGradient = (gradient: Gradient) => {
  const { type, deg, colors } = gradient.value;
  const gradientValue = colors
    .map(({ color, position }) => `${parseRgba(color)} ${position * 100}%`)
    .join(', ');
  return `${type}(${deg}, ${gradientValue})`;
};

const getGradientsParser = (): Parser => {
  const pattern = new RegExp(`${GRADIENTS_NAME}.json$`);

  return {
    pattern,
    parse: ({ contents }) => {
      const { gradients } = JSON.parse(contents);
      const output: DesignTokens = {};

      Object.keys(gradients).forEach(key => {
        const gradient: Gradient = gradients[key];
        const styleValue = buildGradient(gradient);

        if (gradient.type === 'radial-gradient') {
          output[`gradient-radial-${key}`] = {
            value: styleValue
          };
          return;
        }

        output[`gradient-${key}`] = {
          value: styleValue
        };
      });

      return output;
    }
  };
};

const Gradients = ({ frame }: TokenPayload): DesignTokensGenerator => {
  const tokens = getTokens<FigmaGradientComponent, GradientCollection, GradientToken>(
    'Gradients',
    frame,
    getGradients
  );

  return {
    name: 'Gradients',
    tokens,
    writeTokens: writeGradientTokens(tokens)
  };
};

export { Gradients, getGradientsParser, GRADIENT_TYPE };
