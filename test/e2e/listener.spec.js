'use strict';

const assert  = require('chai').assert;
const fs      = require('fs-extra');
const Promise = require('bluebird');
const config  = require('config');

const csv   = require('../../lib/csv');
const mocks = require('../mocks').csv;


const readFiles = (...files) => {
  return Promise.map(files, (file) => {
    return new Promise((resolve, reject) => {
      fs.readFile(file, 'utf-8', (err, data) => {
        return !err ? resolve(data) : reject(err);
      });
    });
  });
};

describe('converter', () => {
  // const fsMock = require('mock-fs');

  // const fsMockOptions = {
  // };
  // fsMockOptions[config.get('paths.input')] = {};
  // fsMockOptions[config.get('paths.output')] = {};
  // fsMockOptions[config.get('paths.errors')] = {};
  // fsMock(fsMockOptions);

  before(() => {
    fs.removeSync(config.get('paths.input'));
    fs.removeSync(config.get('paths.output'));
    fs.removeSync(config.get('paths.errors'));

    fs.mkdirpSync(config.get('paths.input'));
    fs.mkdirpSync(config.get('paths.output'));
    fs.mkdirpSync(config.get('paths.errors'));
  });

  // after(() => {
  //   fs.removeSync('./tmp/test-e2e');
  // });

  describe('#listener()', () => {

    const { listener } = require('../../listener');

    it('should convert single line', (done) => {
      const mock = mocks[1].csv;
      const expected = mocks[1].json;

      const filename = `${config.get('paths.input')}/file.1.csv`;
      fs.writeFile(filename, mock, () => {
        const pathToFile = filename.split('/');
        listener('rename', pathToFile[pathToFile.length - 1])
          .then(() => {
            readFiles(
              `${config.get('paths.output')}/file.1.json`,
              `${config.get('paths.errors')}/file.1.csv`
            )
            .spread((data, errorCsv) => {
              const result = JSON.parse(data);
              assert.deepEqual(result, expected);
              assert.equal(errorCsv.split('\n').length, 1);
              done();
            });
          });
      });
    });

    it('should convert multiple lines', (done) => {
      const mock = mocks[2].csv;
      const expected = mocks[2].json;

      const filename = `${config.get('paths.input')}/file.2.csv`;
      fs.writeFile(filename, mock, () => {
        const pathToFile = filename.split('/');
        listener('rename', pathToFile[pathToFile.length - 1])
          .then(() => {
            readFiles(
              `${config.get('paths.output')}/file.2.json`,
              `${config.get('paths.errors')}/file.2.csv`
            )
            .spread((data, errorCsv) => {
              const result = JSON.parse(data);
              assert.deepEqual(result, expected);
              assert.equal(errorCsv.split('\n').length, 1);
              done();
            });
          });
      });
    });

    it('should detect invalid csv rows', (done) => {
      const mock     = mocks[3].csv;
      const expected = mocks[3].json;
      const expectedErrors = mocks[3].errors.csv;

      const filename = `${config.get('paths.input')}/file.3.csv`;
      fs.writeFile(filename, mock, () => {
        const pathToFile = filename.split('/');
        listener('rename', pathToFile[pathToFile.length - 1])
          .then(() => {
            readFiles(
              `${config.get('paths.output')}/file.3.json`,
              `${config.get('paths.errors')}/file.3.csv`
            )
            .spread((data, errorCsv) => {
              const result = JSON.parse(data);
              assert.deepEqual(result, expected);
              assert.equal(errorCsv, expectedErrors);
              done();
            });
          });
      });
    });

    it('should detect multiple errors for invalid csv rows', (done) => {
      const mock     = mocks[4].csv;
      const expectedErrors = mocks[4].errors.csv;

      const filename = `${config.get('paths.input')}/file.4.csv`;
      fs.writeFile(filename, mock, () => {
        const pathToFile = filename.split('/');
        listener('rename', pathToFile[pathToFile.length - 1])
          .then(() => {
            readFiles(
              `${config.get('paths.output')}/file.4.json`,
              `${config.get('paths.errors')}/file.4.csv`
            )
            .spread((data, errorCsv) => {
              const result = JSON.parse(data);
              assert.deepEqual(result, []);
              assert.equal(errorCsv, expectedErrors);
              done();
            });
          });
      });
    });

  });

});

