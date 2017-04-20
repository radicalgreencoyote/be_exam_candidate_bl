'use strict';

const fs = require('fs');

const getCSVJSONMock = (i, options) => {
  options = options || { csv: true, json: true };
  let csv;
  let json;
  if (options.csv) {
    csv = fs.readFileSync(`./test/mocks/${i}.csv`, 'utf-8');
  }
  if (options.json) {
    json = require(`./${i}.json`);
  }
  return { csv, json };
};

const getErrorMock = (i, options) => {
  options = options || { csv: true, json: true };
  let csv;
  let json;
  if (options.csv) {
    csv = fs.readFileSync(`./test/mocks/${i}.errors.csv`, 'utf-8');
  }
  if (options.json) {
    json = require(`./${i}.errors.json`);
  }
  return {
    errors: { csv, json },
  };
};

const mock3 = Object.assign(
  {}, getCSVJSONMock(3), getErrorMock(3)
);
const mock4 = Object.assign(
  {}, getCSVJSONMock(4, { csv: true }), getErrorMock(4)
);

module.exports = {
  csv: {
    1: getCSVJSONMock(1),
    2: getCSVJSONMock(2),
    3: mock3,
    4: mock4,
  },
};
