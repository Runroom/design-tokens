#!/usr/bin/env node

import parserRuntime from 'yargs-parser';
import designTokens from '@/index.ts';
import { configFileParser, logError } from '@/functions';
import fs from 'fs';

const args = parserRuntime(process.argv.slice(2));

configFileParser(args, fs)
  .then(config => designTokens(config))
  .catch(err => logError(err));
