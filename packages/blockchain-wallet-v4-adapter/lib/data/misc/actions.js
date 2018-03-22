'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchPriceIndexSeriesFailure = exports.fetchPriceIndexSeriesSuccess = exports.fetchPriceIndexSeriesLoading = exports.fetchPriceIndexSeries = undefined;

var _actionTypes = require('./actionTypes');

var AT = _interopRequireWildcard(_actionTypes);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var fetchPriceIndexSeries = exports.fetchPriceIndexSeries = function fetchPriceIndexSeries(coin, currency, start, scale, interval) {
  return { type: AT.FETCH_PRICE_INDEX_SERIES, payload: { coin: coin, currency: currency, start: start, scale: scale, interval: interval } };
};
var fetchPriceIndexSeriesLoading = exports.fetchPriceIndexSeriesLoading = function fetchPriceIndexSeriesLoading() {
  return { type: AT.FETCH_PRICE_INDEX_SERIES_LOADING };
};
var fetchPriceIndexSeriesSuccess = exports.fetchPriceIndexSeriesSuccess = function fetchPriceIndexSeriesSuccess(data) {
  return { type: AT.FETCH_PRICE_INDEX_SERIES_SUCCESS, payload: data };
};
var fetchPriceIndexSeriesFailure = exports.fetchPriceIndexSeriesFailure = function fetchPriceIndexSeriesFailure(error) {
  return { type: AT.FETCH_PRICE_INDEX_SERIES_FAILURE, payload: error };
};