#!/usr/bin/env node

import parserRuntime from 'yargs-parser';
import designTokens from '@/index.ts';
import parseConfigFile from '@/functions/parse-config-file.ts';

const args = parserRuntime(process.argv.slice(2));

parseConfigFile(args)
  .then(config => designTokens(args, config))
  // eslint-disable-next-line no-console
  .catch(err => console.log(err));
