'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _callee;

var _effects = require('redux-saga/effects');

var _sagas = require('./components/sagas');

var _sagas2 = _interopRequireDefault(_sagas);

var _sagas3 = require('./data/sagas');

var _sagas4 = _interopRequireDefault(_sagas3);

var _sagas5 = require('./modules/sagas');

var _sagas6 = _interopRequireDefault(_sagas5);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _marked = /*#__PURE__*/regeneratorRuntime.mark(_callee);

var welcomeSaga = /*#__PURE__*/regeneratorRuntime.mark(function welcomeSaga() {
  var version, style1, style2;
  return regeneratorRuntime.wrap(function welcomeSaga$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (console) {
            version = '4.0.0.0';
            style1 = 'background: #F00; color: #FFF; font-size: 24px;';
            style2 = 'font-size: 18px;';

            console.log('=======================================================');
            console.log('%c Wallet version ' + version, style2);
            console.log('=======================================================');
            console.log('%c STOP!!', style1);
            console.log('%c This browser feature is intended for developers.', style2);
            console.log('%c If someone told you to copy-paste something here,', style2);
            console.log('%c it is a scam and will give them access to your money!', style2);
          }

        case 1:
        case 'end':
          return _context.stop();
      }
    }
  }, welcomeSaga, this);
});

function _callee() {
  return regeneratorRuntime.wrap(function _callee$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return (0, _effects.all)([(0, _effects.call)(welcomeSaga), (0, _effects.fork)(_sagas2.default), (0, _effects.fork)(_sagas4.default), (0, _effects.fork)(_sagas6.default)]);

        case 2:
        case 'end':
          return _context2.stop();
      }
    }
  }, _marked, this);
}