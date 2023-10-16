#!/usr/bin/env node

import parserRuntime from 'yargs-parser';
import designTokens from '@/index.ts';
import configFileParser from '@/functions/configFileParser.ts';

const args = parserRuntime(process.argv.slice(2));

configFileParser(args)
  .then(config => designTokens(args, config))
  // eslint-disable-next-line no-console
  .catch(err => console.error(err));
