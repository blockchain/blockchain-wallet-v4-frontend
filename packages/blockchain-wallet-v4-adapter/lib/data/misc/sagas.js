'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _callee;

var _effects = require('redux-saga/effects');

var _actions = require('./actions');

var A = _interopRequireWildcard(_actions);

var _actionTypes = require('./actionTypes');

var AT = _interopRequireWildcard(_actionTypes);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var _marked = /*#__PURE__*/regeneratorRuntime.mark(_callee);

var watchPriceIndexSeries = /*#__PURE__*/regeneratorRuntime.mark(function watchPriceIndexSeries(action) {
  var _action;

  return regeneratorRuntime.wrap(function watchPriceIndexSeries$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (!true) {
            _context.next = 8;
            break;
          }

          _context.next = 3;
          return (0, _effects.take)(AT.FETCH_PRICE_INDEX_SERIES);

        case 3:
          _action = _context.sent;
          _context.next = 6;
          return (0, _effects.call)(fetchPriceIndexSeries, _action);

        case 6:
          _context.next = 0;
          break;

        case 8:
        case 'end':
          return _context.stop();
      }
    }
  }, watchPriceIndexSeries, this);
});

var fetchPriceIndexSeries = /*#__PURE__*/regeneratorRuntime.mark(function fetchPriceIndexSeries(action) {
  var _action$payload, coin, currency, start, scale, interval, data;

  return regeneratorRuntime.wrap(function fetchPriceIndexSeries$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _action$payload = action.payload, coin = _action$payload.coin, currency = _action$payload.currency, start = _action$payload.start, scale = _action$payload.scale, interval = _action$payload.interval;
          _context2.next = 4;
          return (0, _effects.put)(A.fetchPriceIndexSeriesLoading());

        case 4:
          data = 'test'; // yield call(api.getPriceIndexSeries, coin, currency, start, scale)

          _context2.next = 7;
          return (0, _effects.put)(A.fetchPriceIndexSeriesSuccess({ coin: coin, currency: currency, start: start, scale: scale, interval: interval, data: data }));

        case 7:
          _context2.next = 13;
          break;

        case 9:
          _context2.prev = 9;
          _context2.t0 = _context2['catch'](0);
          _context2.next = 13;
          return (0, _effects.put)(A.fetchPriceIndexSeriesFailure(_context2.t0.message));

        case 13:
        case 'end':
          return _context2.stop();
      }
    }
  }, fetchPriceIndexSeries, this, [[0, 9]]);
});

function _callee() {
  return regeneratorRuntime.wrap(function _callee$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return (0, _effects.fork)(watchPriceIndexSeries);

        case 2:
        case 'end':
          return _context3.stop();
      }
    }
  }, _marked, this);
}