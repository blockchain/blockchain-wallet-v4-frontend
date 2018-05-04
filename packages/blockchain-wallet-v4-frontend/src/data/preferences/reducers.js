import { assoc, assocPath } from 'ramda'
import * as AT from './actionTypes'
import * as priceChartActionTypes from '../components/priceChart/actionTypes'

const INITIAL_STATE = {
  culture: 'en-GB',
  language: 'en',
  theme: 'default',
  coinDisplayed: true,
  showBackupReminder: true,
  showBuyAlert: true,
  showBuyBitcoinReminder: { index: 0, when: new Date().getTime() },
  showEtherWelcome: true,
  showLogoutSurvey: true
}

const preferences = (state = INITIAL_STATE, action) => {
  const { type, payload } = action
  switch (type) {
    case AT.SET_CULTURE: {
      const { culture } = payload
      return assoc('culture', culture, state)
    }
    case AT.SET_LANGUAGE: {
      const { language } = payload
      return assoc('language', language, state)
    }
    case AT.SET_THEME: {
      const { theme } = payload
      return assoc('theme', theme, state)
    }
    case AT.TOGGLE_COIN_DISPLAY: {
      return assoc('coinDisplayed', !state.coinDisplayed, state)
    }
    case AT.SET_ETHER_WELCOME: {
      const { displayed } = payload
      return assoc('showEtherWelcome', displayed, state)
    }
    case priceChartActionTypes.PRICE_CHART_COIN_CLICKED: {
      const { coin } = payload
      return assocPath(['priceChart', 'coin'], coin, state)
    }
    case priceChartActionTypes.PRICE_CHART_TIME_CLICKED: {
      const { time } = payload
      return assocPath(['priceChart', 'time'], time, state)
    }
    default:
      return state
  }
}

export default preferences
