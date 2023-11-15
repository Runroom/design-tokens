import StyleDictionaryNode from 'style-dictionary';
import { EMOJIS, log } from '@/functions';
import {
  Border,
  Breakpoint,
  Color,
  Gradient,
  Shadow,
  Spacing,
  Typography
} from '@/types/designTokens';
import { parseRgba, rgbaGen } from '@/functions/colorManipulation.ts';

type StyleDictionaryOutput = { [key: string]: { value: string | number } };

StyleDictionaryNode.registerParser({
  pattern: /colors\.json$/,
  parse: ({ contents }) => {
    const { colors } = JSON.parse(contents);
    const output: StyleDictionaryOutput = {};

    Object.keys(colors).forEach(key => {
      const color: Color = colors[key];
      const name = `color-${color.name}`;

      output[name] = {
        value: color.hexColor
      };
    });

    return output;
  }
});

StyleDictionaryNode.registerParser({
  pattern: /typographies\.json$/,
  parse: ({ contents }) => {
    const { typography } = JSON.parse(contents);
    const output: StyleDictionaryOutput = {};

    Object.keys(typography).forEach(key => {
      const font: Typography = typography[key];

      output[`font-${key}-size`] = {
        value: font.fontSize
      };
      output[`font-${key}-weight`] = {
        value: font.fontWeight
      };
      output[`font-${key}-line-height`] = {
        value: font.lineHeight
      };
      output[`font-${key}-letter-spacing`] = {
        value: font.letterSpacing
      };
    });

    return output;
  }
});

StyleDictionaryNode.registerParser({
  pattern: /spacings\.json$/,
  parse: ({ contents }) => {
    const { spacings } = JSON.parse(contents);
    const output: StyleDictionaryOutput = {};

    Object.keys(spacings).forEach(key => {
      const spacing: Spacing = spacings[key];

      output[`spacing-${key}`] = {
        value: spacing.remValue
      };
    });

    return output;
  }
});

StyleDictionaryNode.registerParser({
  pattern: /borders\.json$/,
  parse: ({ contents }) => {
    const { borders } = JSON.parse(contents);
    const output: StyleDictionaryOutput = {};

    Object.keys(borders).forEach(key => {
      const border: Border = borders[key];

      output[`border-${key}`] = {
        value: border.value
      };
    });

    return output;
  }
});

StyleDictionaryNode.registerParser({
  pattern: /shadows\.json$/,
  parse: ({ contents }) => {
    const { shadows } = JSON.parse(contents);
    const output: StyleDictionaryOutput = {};

    Object.keys(shadows).forEach(key => {
      const shadow: Shadow = shadows[key];
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

      output[`shadow-drop-filter-${key}`] = {
        value: formattedDropShadow
      };

      output[`shadow-${key}`] = {
        value: formattedShadow
      };
    });

    return output;
  }
});

StyleDictionaryNode.registerParser({
  pattern: /breakpoints\.json$/,
  parse: ({ contents }) => {
    const { breakpoints } = JSON.parse(contents);
    const output: StyleDictionaryOutput = {};

    Object.keys(breakpoints).forEach(key => {
      const breakpoint: Breakpoint = breakpoints[key];

      output[`breakpoint-${key}`] = {
        value: breakpoint.value
      };
    });

    return output;
  }
});

StyleDictionaryNode.registerParser({
  pattern: /gradients\.json$/,
  parse: ({ contents }) => {
    const { gradients } = JSON.parse(contents);
    const output: StyleDictionaryOutput = {};

    Object.keys(gradients).forEach(key => {
      const gradient: Gradient = gradients[key];
      const gradientValue = gradient.colors
        .map(({ color, position }) => `${parseRgba(color)} ${position * 100}%`)
        .join(', ');
      const styleValue = `${gradient.type}(${gradient.deg}, ${gradientValue})`;

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
});

const StyleDictionary = (configFilePath: string) => {
  const extendedDictionary = StyleDictionaryNode.extend(configFilePath);

  log('Compiling styles...', EMOJIS.workingInProgress);
  extendedDictionary.buildAllPlatforms();
  log('Styles compiled', EMOJIS.success);
};

export default StyleDictionary;
