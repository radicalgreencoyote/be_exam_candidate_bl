'use strict';

const logger = require('../config/logger')('csv');

// CSV columns
const INTERNAL_ID = 'INTERNAL_ID';
const FIRST_NAME  = 'FIRST_NAME';
const MIDDLE_NAME = 'MIDDLE_NAME';
const LAST_NAME   = 'LAST_NAME';
const PHONE_NUM   = 'PHONE_NUM';

const ERROR_TYPES = { REQUIRED: 'REQUIRED', INVALID: 'INVALID' };

const LINE_NUM  = 'LINE_NUM';
const ERROR_MSG = 'ERROR_MSG';

// convert error object to human readable string
const toFriendlyErrorMessage = (error) => {
  error = error || {};

  if (error.type === ERROR_TYPES.REQUIRED) {
    return `${error.key} is required`;
  }
  if (error.type === ERROR_TYPES.INVALID && error.key && error.format) {
    return `${error.key} is invalid. Expected format: ${error.format}`;
  }
  return 'An unexpected error occurred...';
};

// detect validation errors for given person row
const validate = (record, i) => {
  const collector = [];
  if (i !== undefined && i !== null) {
    i+=1;
  }
  record = Object.assign({}, record);
  if (!record.id) {
    const error = {
      type: ERROR_TYPES.REQUIRED, key: INTERNAL_ID,
    };
    collector.push(error);
  }

  if (record.name && !record.name.first) {
    const error = {
      type: ERROR_TYPES.REQUIRED, key: FIRST_NAME,
    };
    collector.push(error);
  }
  if (record.name && !record.name.last) {
    const error = {
      type: ERROR_TYPES.REQUIRED, key: LAST_NAME,
    };
    collector.push(error);
  }

  if (!record.phone) {
    const error = {
      type: ERROR_TYPES.REQUIRED, key: PHONE_NUM,
    };
    collector.push(error);
  }

  if (record.id && !record.id.match(/^\d{8}$/)) {
    const error = {
      type: ERROR_TYPES.INVALID,
      format: '#########',
      key: INTERNAL_ID, value: record.id,
    };
    collector.push(error);
  }

  if (record.name.first.length > 15) {
    const error = {
      type: ERROR_TYPES.INVALID,
      format: '15 characters max',
      key: FIRST_NAME, value: record.name.first,
    };
    collector.push(error);
  }
  if (record.name.middle && record.name.middle.length > 15) {
    const error = {
      type: ERROR_TYPES.INVALID,
      format: '15 characters max',
      key: MIDDLE_NAME, value: record.name.middle,
    };
    collector.push(error);
  }
  if (record.name.last.length > 15) {
    const error = {
      type: ERROR_TYPES.INVALID,
      format: '15 characters max',
      key: LAST_NAME, value: record.name.last,
    };
    collector.push(error);
  }

  if (record.phone && !record.phone.match(/^\d{3}-\d{3}-\d{4}$/)) {
    const error = {
      type: ERROR_TYPES.INVALID,
      format: '###-###-####',
      key: PHONE_NUM, value: record.phone,
    };
    collector.push(error);
  }

  if (collector.length > 0) {
    return Promise.resolve({
      error: true,
      errors: collector,
      index: i,
    });
  }

  record.id = parseInt(record.id, 10);

  return Promise.resolve(record);
};

const parse = (data) => {
  const lines = data.split('\n');
  const header = lines[0].split(',');

  const parsedRows = lines.slice(1)
    .filter((line) => !!line)
    .map((line) => {
      const values = line.split(',');
      return header.reduce((acm, k, i) => {
        acm[k] = values[i];
        return acm;
      }, {});
    })
    .map((row, i) => {
      const transformedRecord = Object.assign({}, {
        id: row[INTERNAL_ID],
        name: { first: row[FIRST_NAME], last: row[LAST_NAME] },
        phone: row[PHONE_NUM],
      });
      if (row[MIDDLE_NAME]) {
        transformedRecord.name.middle = row[MIDDLE_NAME];
      }
      return transformedRecord;
    })
    .map(validate);

    return Promise.all(parsedRows)
      .then((results) => {
        const rows = results.filter((row) => !row.error);
        const errors = results.filter((row) => row.error);
        logger.debug({ rows, errors });
        return { rows, errors };
      });
};

const toErrorCSV = (errors) => {
  const header = [LINE_NUM, ERROR_MSG];
  if (!errors) {
    return header.join(',');
  }

  const rows = errors.reduce((acm, error) => {
    return acm.concat(
      error.errors.map((e) => Object.assign({ index: error.index }, e))
    );
  }, [])
  .map((error) => {
    return [error.index, toFriendlyErrorMessage(error)];
  });

  return [header, ...rows]
    .map((row) => row.join(','))
    .join('\n');
};

module.exports = {
  parse,
  toErrorCSV,
};
