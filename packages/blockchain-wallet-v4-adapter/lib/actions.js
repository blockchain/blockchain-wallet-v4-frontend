'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.modules = exports.data = exports.components = undefined;

var _actions = require('./components/actions');

var components = _interopRequireWildcard(_actions);

var _actions2 = require('./data/actions');

var data = _interopRequireWildcard(_actions2);

var _actions3 = require('./modules/actions');

var modules = _interopRequireWildcard(_actions3);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports.components = components;
exports.data = data;
exports.modules = modules;