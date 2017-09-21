/**
 * backends.js - database backends for bcoin
 * Copyright (c) 2014-2017, Christopher Jeffrey (MIT License).
 * https://github.com/bcoin-org/bcoin
 */

'use strict';

exports.get = function get(name) {
  try {
    console.info('Try to load db backend ', name);
    return require('./memdb');
  } catch (e) {
    if (e.code === 'MODULE_NOT_FOUND')
      throw new Error(`Database backend "${name}" not found.`);
    throw e;
  }
};
