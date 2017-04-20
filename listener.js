'use strict';

const Promise = require('bluebird');
const config  = require('config');
const logger  = require('./config/logger')('listener');

const INPUT_PATH  = config.get('paths.input');
const OUTPUT_PATH = config.get('paths.output');
const ERRORS_PATH = config.get('paths.errors');

const {
  readFile, writeFile, unlink,
} = require('./lib/fs');
const csv  = require('./lib/csv');


// visited files
const processed = {};

// on file watch event function
const listener = (eventType, filename) => {
  if (!filename) {
    logger.warn('filename missing from watch event');
    return Promise.resolve();
  }
  if (!filename.match(/.csv$/)) {
    logger.warn({ filename }, 'wrong file extension discovered...');
    return Promise.resolve();
  }
  if (processed[filename]) {
    return Promise.resolve();
  }

  logger.debug({ event: eventType, file: `${INPUT_PATH}/${filename}` }, 'fs event');

  // 1. read file contents
  // 2. convert csv to objects
  // 3. write results
  // 4. flag file as processed
  // 5. delete processed input file
  return readFile(`${INPUT_PATH}/${filename}`, 'utf-8')
    .then((contents) => {
      logger.debug(contents);
      // 2.
      return csv.parse(contents)
        .then(({ rows, errors }) => {
          // 3.
          return Promise.all([
            writeFile(
              `${OUTPUT_PATH}/${filename.replace('.csv', '.json')}`, JSON.stringify(rows, null, 4)
            ),
            writeFile(
              `${ERRORS_PATH}/${filename}`, csv.toErrorCSV(errors)
            ),
          ]);
        });
    })
    // 4.
    .then(() => {
      processed[filename] = true;
    })
    // 5.
    .then(() => unlink(`${INPUT_PATH}/${filename}`))
    .catch((err) => logger.error(err));
};

// expose listener callback for tests
module.exports = {
  listener,
};
