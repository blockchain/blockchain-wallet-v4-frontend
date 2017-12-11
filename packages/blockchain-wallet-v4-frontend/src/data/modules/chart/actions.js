import * as AT from './actionTypes'

// export const initChart = (coin, currency, start, scale) => ({ type: AT.INIT_CHART, payload: { coin, currency, start, scale } })
export const initChart = (coin, timeframe) => ({ type: AT.INIT_CHART, payload: { coin, timeframe } })

export const refreshChart = (coin, timeframe) => ({ type: AT.REFRESH_CHART, payload: { coin, timeframe } })
