import * as AT from './actionTypes'

export const fetchPriceIndexSeries = (coin, currency, start, scale) => ({ type: AT.FETCH_PRICE_INDEX_SERIES, payload: { coin, currency, start, scale } })
export const fetchPriceIndexSeriesLoading = () => ({ type: AT.FETCH_PRICE_INDEX_SERIES_LOADING })
export const fetchPriceIndexSeriesSuccess = (data) => ({ type: AT.FETCH_PRICE_INDEX_SERIES_SUCCESS, payload: data })
export const fetchPriceIndexSeriesFailure = (error) => ({ type: AT.FETCH_PRICE_INDEX_SERIES_FAILURE, payload: error })
