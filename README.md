# Design tokens

[![npm version](https://img.shields.io/npm/v/@runroom/design-tokens.svg)](https://www.npmjs.com/package/@runroom/design-tokens)
![node](https://img.shields.io/node/v/@runroom/design-tokens.svg)

[![CI](https://github.com/Runroom/design-tokens/actions/workflows/ci.yaml/badge.svg)](https://github.com/Runroom/design-tokens/actions/workflows/ci.yaml)

Originally inspired on: [figma-tokens](https://github.com/klaufel/figma-tokens).

## Installation

`npm install @runroom/design-tokens --save-dev`

## Usage

### Execution

Then execute:

- `npx design-tokens`: If you want to sync with figma.

You can specify a different config file name using the parameter `--config-file=FILENAME`. For
example:

- `npx design-tokens --config-file=myfile.{json,js}`

### Config

Add a config file on the root directory of your project. This repository uses the standard config file naming
by [cosmiconfig](https://www.npmjs.com/package/cosmiconfig).
By default, the config file name should be use `designtokens` as module name, like `.designtokensrc.json`
or `.designtokensrc.js`, also as a `package.json` entry with the key `designtokens`.

If you want to use a different name for your config file, you can use the parameter `--config-file=FILENAME` when you
execute the command.

You can find a template for your config file [here](.template-designtokensrc.json).

#### Explanation of config file fields

`figmaApiKey`: Your figma unique Api key to perform the auth on figma's API

`figmaProjectId`: Your figma project ID (Can be found in your's project URL, after the figma.com/file/FIGMA_ID/..)

`figmaPages`: An object with the figma pages you want to sync. The key is the name of the page and the value is an
array of the figma frames that contains the tokens

`outputDir`: The source where will be stored the package's output

### Optional config

`figmaThemes`: An array of the name of the themes you want to sync. This option is only available for color tokens, and
we take as theme the first block of the name. For example: `dark-primary` or `dark-background-secondary` will be `dark`.

#### Config for [Style Dictionary](https://amzn.github.io/style-dictionary/#/config)

`styleDictionary`: The style dictionary config

## Theming: How to use the themes

The themes are generated in the same file as the tokens, but if you want to extract the themes to a different file with
the selector `[data-theme="THEME_NAME"]`, you can add the following config to the css files, in the style dictionary
config, how you can see in the config template:

```json
{
    "destination": "variables-themes.css",
    "format": "css/variables-themes"
}
```

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

4. **Create a Token:**
    - To manage and process the new tokens, you'll need to create a corresponding class.
    - Inside the `src/tokens` directory, create a new TypeScript file with a method that return
      a `DesignTokensGenerator`.
    - Implement the necessary methods for handling the new tokens. These methods may include writing to
      files, or other token-specific functionality.

5. **Define Token Types:**
    - Make sure to define the types associated with the new tokens.
    - In the `src/types/figma` directory, define types that reflect the structure of the new tokens in Figma.
    - In the `src/types/designTokens` directory, define types specific to how the tokens will be used.

6. **Add Token to Style Dictionary:**
    - If the token needs a specific parser, add it to the `src/styleDictionary/styleDictionary.ts` file.

## License

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This project is under the [MIT license](LICENSE).
