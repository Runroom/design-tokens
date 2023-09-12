# Design tokens

[![npm version](https://img.shields.io/npm/v/@runroom/design-tokens.svg)](https://www.npmjs.com/package/@runroom/design-tokens)
![node](https://img.shields.io/node/v/@runroom/design-tokens.svg)

[![CI](https://github.com/Runroom/design-tokens/actions/workflows/ci.yaml/badge.svg)](https://github.com/Runroom/design-tokens/actions/workflows/ci.yaml)
[![QA](https://github.com/Runroom/design-tokens/actions/workflows/qa.yaml/badge.svg)](https://github.com/Runroom/design-tokens/actions/workflows/qa.yaml)
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


| Field  | Description |
| ------------- | ------------- |
| FIGMA_APIKEY | Yep... Figma API key  |
| FIGMA_ID  | Your user ID, you can find it when sharing something. [More info here](https://iconify.design/docs/libraries/tools/import/figma/file-id.html) |
| FIGMA_PAGE_NAME | The name of the page, be aware of spaces and everything (emojis)...  |
| TOKENS_DIR | Where do you want to create the output files in your project.  |
| pages | The FRAMES inside the page you want to take the tokens from.  |
| source | ... IDK  |
| platforms | The "platform" you will use this tokens. |

<!-- TODO: I'd say this is outdated, check [Figma Tokens](https://github.com/klaufel/figma-tokens) -->

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
