# Design tokens

[![npm version](https://img.shields.io/npm/v/@runroom/design-tokens.svg)](https://www.npmjs.com/package/@runroom/design-tokens)
![node](https://img.shields.io/node/v/@runroom/design-tokens.svg)

[![CI](https://github.com/Runroom/design-tokens/actions/workflows/ci.yaml/badge.svg)](https://github.com/Runroom/design-tokens/actions/workflows/ci.yaml)

Originally inspired on: [figma-tokens](https://github.com/klaufel/figma-tokens).

## Installation

`npm install @runroom/design-tokens --save-dev`

## Usage

### Config

Add a config file on the root directory of your project with the default name
`designtokens.config.json` or `design-tokens.config.json`. If you chose to call it differently,
specify a different config file while executing. You can find a template for your config file
[here](template.config.json)

#### Explanation of config file fields

`figmaApiKey`: Your figma unique Api key to perform the auth on figma's API

`figmaProjectId`: Your figma project ID (Can be found in your's project URL, after the figma.com/file/FIGMA_ID/..)

`figmaPages`: An object with the figma pages you want to sync. The key is the name of the page and the value is an
array of the figma frames that contains the tokens

`outputDir`: The source where will be stored the package's output

`figmaThemes`: An array of your's figma project themes. If you aren't usign themes, just remove the key (first element of the
array, will be setted as default)

`source`: It is used by the platforms option to determine the json file

`platforms`: You can set here your's platforms setting in case you are using it (design-tokens platforms).

### Execution

Then execute:

- `npx design-tokens`: If you want to sync with figma.
- `npx design-tokens platforms`: If you want to sync and compile assets.

You can specify a different config file name using the parameter `--config-file=FILENAME`. For
example:

- `npx design-tokens --config-file=myfile.json`

## For Devs:

### Adding New Figma Tokens

Expanding the design tokens in your project is a straightforward process. Here's how you can add new Figma tokens:

1. **Create a Figma Frame:**
    - In Figma, create a new frame that represents the design tokens you want to add.
    - Give the frame a clear and descriptive name that reflects the purpose of the tokens.

2. **Update the Configuration:**
    - Open the design-tokens configuration file (`designtokens.config.json` or similar).
    - Add the name of the newly created Figma frame to the `pages` array. This ensures that your project recognizes the
      new tokens.

3. **Define Token Information:**
    - Add an entry for the new tokens in `src/designTokensPages.ts`. This entry should include the name of the page and
      the class for this token.

4. **Create a Token Class:**
    - To manage and process the new tokens, you'll need to create a corresponding class.
    - Inside the `src/classes` directory, create a new TypeScript class that extends the `DesignTokens` class.
    - Implement the necessary methods for handling the new tokens. These methods may include generating CSS, writing to
      files, or other token-specific functionality.

5. **Define Token Types:**
    - Make sure to define the types associated with the new tokens.
    - In the `src/types/figma` directory, define types that reflect the structure of the new tokens in Figma.
    - In the `src/types/designTokens` directory, define types specific to how the tokens will be used.

## License

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This project is under the [MIT license](LICENSE).
