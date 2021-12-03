#!/usr/bin/env node

import parserRuntime from 'yargs-parser';
import designTokens from '../index.js';

designTokens(parserRuntime(process.argv.slice(2)));
