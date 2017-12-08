import * as AT from './actionTypes'

export const initChart = (coin, currency, start, scale) => ({ type: AT.INIT_CHART, payload: { coin, currency, start, scale } })
