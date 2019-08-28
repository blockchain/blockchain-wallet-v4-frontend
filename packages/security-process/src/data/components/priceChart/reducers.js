import { assoc } from 'ramda'
import * as AT from './actionTypes'

const INITIAL_STATE = {
  coin: 'BTC',
  time: 'all'
}

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.PRICE_CHART_INITIALIZED: {
      const { coin, time } = payload
      return { coin, time }
    }
    case AT.PRICE_CHART_COIN_CLICKED: {
      const { coin } = payload
      return assoc('coin', coin, state)
    }
    case AT.PRICE_CHART_TIME_CLICKED: {
      const { time } = payload
      return assoc('time', time, state)
    }
    default:
      return state
  }
}
