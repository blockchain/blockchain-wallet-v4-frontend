'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _redux = require('redux');

var _reducers = require('./components/reducers.js');

var _reducers2 = _interopRequireDefault(_reducers);

var _reducers3 = require('./data/reducers.js');

var _reducers4 = _interopRequireDefault(_reducers3);

var _reducers5 = require('./modules/reducers.js');

var _reducers6 = _interopRequireDefault(_reducers5);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (0, _redux.combineReducers)({
  components: _reducers2.default,
  data: _reducers4.default,
  modules: _reducers6.default
});