'use strict';

const bunyan = require('bunyan');
const config = require('config');

const name   = require('../package.json').name;
const level  = config.logger.level;
const logger = bunyan.createLogger({ name, level });

module.exports = (module) => {
  if (!module) {
    return logger;
  }
  return logger.child({ module });
};
