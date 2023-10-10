# Design tokens

[![npm version](https://img.shields.io/npm/v/@runroom/design-tokens.svg)](https://www.npmjs.com/package/@runroom/design-tokens)
![node](https://img.shields.io/node/v/@runroom/design-tokens.svg)

[![CI](https://github.com/Runroom/design-tokens/actions/workflows/ci.yaml/badge.svg)](https://github.com/Runroom/design-tokens/actions/workflows/ci.yaml)
[![codecov](https://codecov.io/gh/Runroom/design-tokens/branch/main/graph/badge.svg)](https://codecov.io/gh/Runroom/design-tokens)

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

`FIGMA_APIKEY`: Your figma unique Api key to perform the auth on figma's API

`FIGMA_ID`: Your figma project ID (Can be found in your's project URL, after the figma.com/file/FIGMA_ID/..)

`FIGMA_PAGE_NAME`: The name of your figma's page

`TOKENS_DIR`: The source where will be stored the package's output

`pages`: This is an array of the "Frames" that have the tokens attached (ex: "Colors", "Typography")

`themes`: An array of your's figma project themes. If you aren't usign themes, just remove the key (first element of the array, will be setted as default)

`source`: It is used by the platforms option to determine the json file

`platforms`: You can set here your's platforms setting in case you are using it (design-tokens platforms).

### Execution

Then execute:

- `npx design-tokens`: If you want to sync with figma.
- `npx design-tokens platforms`: If you want to sync and compile assets.

You can specify a different config file name using the parameter `--config-file=FILENAME`. For
example:

- `npx design-tokens --config-file=myfile.json`

## License

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This project is under the [MIT license](LICENSE).
