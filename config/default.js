'use strict';

module.exports = {
  logger: {
    level: process.env.LOGLEVEL || 'INFO'
  },
  paths: {
    input: process.env.INPUT_PATH || './input-directory',
    output: process.env.OUTPUT_PATH || './output-directory',
    errors: process.env.ERROR_PATH || './error-directory',
  },
};
