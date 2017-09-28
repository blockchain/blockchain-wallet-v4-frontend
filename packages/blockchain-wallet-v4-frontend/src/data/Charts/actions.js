import * as AT from './actionTypes'

export const fetchPriceIndexSeries = (coin, timeframe, start, scale) => ({ type: AT.FETCH_PRICE_INDEX_SERIES, payload: { coin, timeframe, start, scale } })

export const fetchPriceIndexSeriesSuccess = (data) => ({ type: AT.FETCH_PRICE_INDEX_SERIES_SUCCESS, payload: { data } })

export const fetchPriceIndexSeriesError = (message) => ({ type: AT.FETCH_PRICE_INDEX_SERIES_ERROR, payload: message })
