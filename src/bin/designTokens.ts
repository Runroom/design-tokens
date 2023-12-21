#!/usr/bin/env node

import parserRuntime from 'yargs-parser';
import designTokens from '@/index.ts';
import { configFileParser, logError } from '@/functions';

const args = parserRuntime(process.argv.slice(2));

configFileParser(args)
  .then(config => designTokens(config))
  .catch(err => logError(err));
