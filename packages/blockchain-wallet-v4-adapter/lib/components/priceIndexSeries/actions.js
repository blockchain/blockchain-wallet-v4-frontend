'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.coinClicked = exports.timeClicked = exports.initialized = undefined;

var _actionTypes = require('./actionTypes');

var AT = _interopRequireWildcard(_actionTypes);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var initialized = exports.initialized = function initialized(time, coin) {
  return { type: AT.PRICE_INDEX_SERIES_INITIALIZED, payload: { time: time, coin: coin } };
};

var timeClicked = exports.timeClicked = function timeClicked(time) {
  return { type: AT.PRICE_INDEX_SERIES_TIME_CLICKED, payload: { time: time } };
};

var coinClicked = exports.coinClicked = function coinClicked(coin) {
  return { type: AT.PRICE_INDEX_SERIES_COIN_CLICKED, payload: { coin: coin } };
};