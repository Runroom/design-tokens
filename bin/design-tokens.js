#!/usr/bin/env node

import parserRuntime from 'yargs-parser';
import designTokens from '../index.js';
import parseConfigFile from '../src/parse-config-file.js';

const args = parserRuntime(process.argv.slice(2));

parseConfigFile(args)
  .then(config => designTokens(args, config))
  .catch(err => console.log(err));
