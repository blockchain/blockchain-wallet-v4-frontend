'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _callee;

var _effects = require('redux-saga/effects');

var _actionTypes = require('./actionTypes');

var AT = _interopRequireWildcard(_actionTypes);

var _actions = require('../../actions.js');

var actions = _interopRequireWildcard(_actions);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var _marked = /*#__PURE__*/regeneratorRuntime.mark(_callee);

// import * as sagas from '../../sagas.js'

var calculateScale = function calculateScale(time) {
  return { start: '', scale: '' };
};

var initialized = /*#__PURE__*/regeneratorRuntime.mark(function initialized(action) {
  var _action$payload, coin, time, currency, _calculateScale, start, scale, interval;

  return regeneratorRuntime.wrap(function initialized$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _action$payload = action.payload, coin = _action$payload.coin, time = _action$payload.time;
          currency = 'USD';
          _calculateScale = calculateScale(coin, time), start = _calculateScale.start, scale = _calculateScale.scale, interval = _calculateScale.interval;
          _context.next = 6;
          return (0, _effects.put)(actions.data.misc.fetchPriceIndexSeries, coin, currency, start, scale, interval);

        case 6:
          _context.next = 10;
          break;

        case 8:
          _context.prev = 8;
          _context.t0 = _context['catch'](0);

        case 10:
        case 'end':
          return _context.stop();
      }
    }
  }, initialized, this, [[0, 8]]);
});

var coinClicked = /*#__PURE__*/regeneratorRuntime.mark(function coinClicked(action) {
  return regeneratorRuntime.wrap(function coinClicked$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return (0, _effects.put)(actions);

        case 3:
          _context2.next = 7;
          break;

        case 5:
          _context2.prev = 5;
          _context2.t0 = _context2['catch'](0);

        case 7:
        case 'end':
          return _context2.stop();
      }
    }
  }, coinClicked, this, [[0, 5]]);
});

var timeClicked = /*#__PURE__*/regeneratorRuntime.mark(function timeClicked(action) {
  return regeneratorRuntime.wrap(function timeClicked$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return (0, _effects.put)(actions);

        case 3:
          _context3.next = 7;
          break;

        case 5:
          _context3.prev = 5;
          _context3.t0 = _context3['catch'](0);

        case 7:
        case 'end':
          return _context3.stop();
      }
    }
  }, timeClicked, this, [[0, 5]]);
});

function _callee() {
  return regeneratorRuntime.wrap(function _callee$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return (0, _effects.takeEvery)(AT.PRICE_INDEX_SERIES_INITIALIZED, initialized);

        case 2:
          _context4.next = 4;
          return (0, _effects.takeEvery)(AT.PRICE_INDEX_SERIES_COIN_CLICKED, coinClicked);

        case 4:
          _context4.next = 6;
          return (0, _effects.takeEvery)(AT.PRICE_INDEX_SERIES_TIME_CLICKED, timeClicked);

        case 6:
        case 'end':
          return _context4.stop();
      }
    }
  }, _marked, this);
}