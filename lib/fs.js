'use strict';

const fs      = require('fs');
const Promise = require('bluebird');

// wrap used fs functions with promises
const mkdir     = Promise.promisify(fs.mkdir);
const open      = Promise.promisify(fs.open);
const readFile  = Promise.promisify(fs.readFile);
const writeFile = Promise.promisify(fs.writeFile);
const unlink    = Promise.promisify(fs.unlink);
const close     = Promise.promisify(fs.close);

module.exports = {
  fs,
  mkdir,
  open,
  readFile,
  writeFile,
  unlink,
  close,
};
