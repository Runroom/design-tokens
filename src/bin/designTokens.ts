#!/usr/bin/env node

import parserRuntime from 'yargs-parser';
import designTokens from '@/index.ts';
import { logError, configFileParser } from '@/functions';

const args = parserRuntime(process.argv.slice(2));

configFileParser(args)
  .then(config => designTokens(args, config))
  .catch(err => logError(err));
