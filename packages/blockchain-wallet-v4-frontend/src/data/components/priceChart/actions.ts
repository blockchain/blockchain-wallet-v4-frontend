import { CoinType, TimeRange } from 'core/types'

import * as AT from './actionTypes'

export const initialized = (coin: CoinType, time: TimeRange) => ({
  type: AT.PRICE_CHART_INITIALIZED,
  payload: { coin, time }
})
export const timeClicked = time => ({
  type: AT.PRICE_CHART_TIME_CLICKED,
  payload: { time }
})
export const coinClicked = coin => ({
  type: AT.PRICE_CHART_COIN_CLICKED,
  payload: { coin }
})
