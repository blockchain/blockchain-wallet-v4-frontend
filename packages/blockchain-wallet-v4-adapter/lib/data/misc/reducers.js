'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ramda = require('ramda');

var _src = require('blockchain-wallet-v4/src');

var _actionTypes = require('./actionTypes');

var AT = _interopRequireWildcard(_actionTypes);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var INITIAL_STATE = _src.Remote.NotAsked;

exports.default = function () {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : INITIAL_STATE;
  var action = arguments[1];
  var type = action.type,
      payload = action.payload;


  switch (type) {
    case AT.FETCH_PRICE_INDEX_SERIES_LOADING:
      {
        return (0, _ramda.assoc)('price_index_series', _src.Remote.Loading, state);
      }
    case AT.FETCH_PRICE_INDEX_SERIES_SUCCESS:
      {
        return (0, _ramda.assoc)('price_index_series', _src.Remote.Success(payload), state);
      }
    case AT.FETCH_PRICE_INDEX_SERIES_FAILURE:
      {
        return (0, _ramda.assoc)('price_index_series', _src.Remote.Failure(payload), state);
      }
    default:
      return state;
  }
};