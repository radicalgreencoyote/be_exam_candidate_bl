'use strict';

const assert  = require('chai').assert;
const Promise = require('bluebird');

const csv   = require('../../lib/csv');
const mocks = require('../mocks').csv;

describe('csv', () => {

  describe('#parse()', () => {

    it('should convert single line', () => {
      const mock = mocks[1].csv;
      const expected = mocks[1].json;
      return csv.parse(mock)
        .then(({ rows, errors }) => {
          assert.deepEqual(rows, expected);
          assert.equal(errors.length, 0);
        });
    });

    it('should convert multiple lines', () => {
      const mock = mocks[2].csv;
      const expected = mocks[2].json;
      return csv.parse(mock)
        .then(({ rows, errors }) => {
          assert.deepEqual(rows, expected);
          assert.equal(errors.length, 0);
        });
    });

    it('should detect invalid csv rows', () => {
      const mock = mocks[3].csv;
      const expected = mocks[3].json;
      const expectedErrors = mocks[3].errors.json;
      return csv.parse(mock)
        .then(({ rows, errors }) => {
          assert.deepEqual(rows, expected);
          assert.deepEqual(errors, expectedErrors);
        });
    });

    it('should detect multiple errors for invalid csv rows', () => {
      const mock = mocks[4].csv;
      const expectedErrors = mocks[4].errors.json;
      return csv.parse(mock)
        .then(({ rows, errors }) => {
          assert.deepEqual(rows, []);
          assert.deepEqual(errors, expectedErrors);
        });
    });

  });

  describe('#toErrorCSV()', () => {

    it('should produce error lines', () => {
      const mock = mocks[3].csv;
      const expected = mocks[3].errors.csv;
      return csv.parse(mock)
        .then(({ errors }) => csv.toErrorCSV(errors))
        .then((errors) => {
          assert.equal(errors, expected);
        });
    });

  });

});

