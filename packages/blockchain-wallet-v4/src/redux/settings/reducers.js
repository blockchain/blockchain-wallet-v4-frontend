import * as T from './actionTypes'

const INITIAL_STATE = {
  btc_currency: 'BTC',
  language: 'en',
  currency: 'USD',
  country_code: 'US'
}

const settingsReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case T.FETCH_SETTINGS_SUCCESS: {
      return payload
    }
    default:
      return state
  }
}

export default settingsReducer
