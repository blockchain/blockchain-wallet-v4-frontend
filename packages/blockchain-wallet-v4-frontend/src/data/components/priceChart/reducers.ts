import * as AT from './actionTypes'

const INITIAL_STATE = {
  coin: 'BTC',
  time: 'all'
}

export function priceChartReducer (state = INITIAL_STATE, action) {
  const { payload, type } = action

  switch (type) {
    case AT.PRICE_CHART_INITIALIZED: {
      const { coin, time } = payload
      return { coin, time }
    }
    case AT.PRICE_CHART_COIN_CLICKED: {
      const { coin } = payload
      return {
        ...state,
        coin
      }
    }
    case AT.PRICE_CHART_TIME_CLICKED: {
      const { time } = payload
      return {
        ...state,
        time
      }
    }
    default:
      return state
  }
}
