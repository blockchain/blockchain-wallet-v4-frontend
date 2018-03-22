'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calculateScale = undefined;

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var INTERVALS = {
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000
};
var SCALES = {
  FIFTEENMIN: 15 * 60,
  HOUR: 60 * 60,
  TWOHOUR: 2 * 60 * 60,
  DAY: 24 * 60 * 60,
  FIVEDAY: 5 * 24 * 60 * 60
};

var BTCSTART = 1282089600;
var ETHSTART = 1438992000;
var BCHSTART = 1500854400;
var start = { 'BTC': BTCSTART, 'ETH': ETHSTART, 'BCH': BCHSTART };

var calculateScale = exports.calculateScale = function calculateScale(coin, timeframe) {
  switch (timeframe) {
    case 'year':
      var yearStart = (0, _moment2.default)().subtract(1, 'year');
      return {
        start: yearStart > start.coin ? yearStart.format('X') : start.coin,
        scale: SCALES.DAY,
        interval: INTERVALS.DAY
      };
    case 'month':
      var monthStart = (0, _moment2.default)().subtract(1, 'month');
      return {
        start: monthStart > start.coin ? monthStart.format('X') : start.coin,
        scale: SCALES.TWOHOUR,
        interval: INTERVALS.DAY
      };
    case 'week':
      var weekStart = (0, _moment2.default)().subtract(7, 'day');
      return {
        start: weekStart > start.coin ? weekStart.format('X') : start.coin,
        scale: SCALES.HOUR,
        interval: INTERVALS.HOUR
      };
    case 'day':
      var dayStart = (0, _moment2.default)().subtract(1, 'day');
      return {
        start: dayStart > start.coin ? dayStart.format('X') : start.coin,
        scale: SCALES.FIFTEENMIN,
        interval: INTERVALS.HOUR
      };
    default:
      return {
        start: start.coin,
        scale: SCALES.FIVEDAY,
        interval: INTERVALS.DAY
      };
  }
};
//     .map(map(d => [d.timestamp * 1000, d.price]))