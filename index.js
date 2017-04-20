'use strict';

const Promise = require('bluebird');
const config  = require('config');
const logger  = require('./config/logger')();

const INPUT_PATH  = config.get('paths.input');
const OUTPUT_PATH = config.get('paths.output');
const ERRORS_PATH = config.get('paths.errors');

const { fs, mkdir } = require('./lib/fs');
const { listener }  = require('./listener');

// (1.) setup paths and (2.) fs watch listener
Promise.map([
  INPUT_PATH, OUTPUT_PATH, ERRORS_PATH,
], (path, i) => {
  logger.debug(i, path);

  // 1.
  return mkdir(path)
    .catch((err) => {
      if (err.code !== 'EEXIST') {
        logger.error(err, err.name);
        process.exit(1);
      }
      return Promise.resolve('ok');
    });
})
// 2.
.then(() => {
  logger.info({ paths: config.get('paths') }, 'starting filesystem listener');
  fs.watch(INPUT_PATH, { encoding: 'utf-8' }, listener);
});
