Design tokens
=============

[![npm version](https://img.shields.io/npm/v/@runroom/design-tokens.svg)](https://www.npmjs.com/package/@runroom/design-tokens)
![node](https://img.shields.io/node/v/@runroom/design-tokens.svg)

![ci](https://github.com/Runroom/design-tokens/workflows/ci/badge.svg)
[![codecov](https://codecov.io/gh/Runroom/design-tokens/branch/main/graph/badge.svg)](https://codecov.io/gh/Runroom/design-tokens)

Originally inspired on: [figma-tokens](https://github.com/klaufel/figma-tokens).

## Installation

`npm install --dev @runroom/design-tokens`

## Usage

### Config

Add a config file on the root directory of your project with the default name
`designtokens.config.json` or `design-tokens.config.json`. If you chose to call it differently,
specify a different config file while executing. You can find a template for your config file
[here](template.config.json)

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
