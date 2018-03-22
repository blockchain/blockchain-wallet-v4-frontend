'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _callee;

var _effects = require('redux-saga/effects');

var _sagas = require('./misc/sagas');

var _sagas2 = _interopRequireDefault(_sagas);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _marked = /*#__PURE__*/regeneratorRuntime.mark(_callee);

function _callee() {
  return regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return (0, _effects.fork)(_sagas2.default);

        case 2:
        case 'end':
          return _context.stop();
      }
    }
  }, _marked, this);
}