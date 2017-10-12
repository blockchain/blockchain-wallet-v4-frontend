import * as AT from './actionTypes'
import { assign } from 'services/RamdaCookingBook'

const INITIAL_STATE = {
  culture: 'en-GB',
  language: 'en',
  theme: 'default',
  coinDisplayed: true
}

const preferences = (state = INITIAL_STATE, action) => {
  const { type, payload } = action
  switch (type) {
    case AT.SET_CULTURE: {
      return assign(state, { culture: payload })
    }
    case AT.SET_LANGUAGE: {
      return assign(state, { language: payload })
    }
    case AT.SET_THEME: {
      return assign(state, { theme: payload })
    }
    case AT.TOGGLE_COIN_DISPLAY: {
      return assign(state, { coinDisplayed: !state.coinDisplayed })
    }
    default:
      return state
  }
}

export default preferences
