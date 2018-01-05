import { assoc } from 'ramda'
import * as AT from './actionTypes.js'
import * as RD from '../../remoteData'

const INITIAL_STATE = {
  adverts: RD.NotAsked(),
  captcha: RD.NotAsked(),
  logs: RD.NotAsked(),
  price_index_series: RD.NotAsked()
}

const miscReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.FETCH_ADVERTS_LOADING: {
      return assoc('adverts', RD.Loading(), state)
    }
    case AT.FETCH_ADVERTS_SUCCESS: {
      return assoc('adverts', RD.Success(payload), state)
    }
    case AT.FETCH_ADVERTS_FAILURE: {
      return assoc('adverts', RD.Failed(payload), state)
    }
    case AT.FETCH_CAPTCHA_LOADING: {
      return assoc('captcha', RD.Loading(), state)
    }
    case AT.FETCH_CAPTCHA_SUCCESS: {
      return assoc('captcha', RD.Success(payload), state)
    }
    case AT.FETCH_CAPTCHA_FAILURE: {
      return assoc('captcha', RD.Failed(payload), state)
    }
    case AT.FETCH_LOGS_LOADING: {
      return assoc('logs', RD.Loading(), state)
    }
    case AT.FETCH_LOGS_SUCCESS: {
      return assoc('logs', RD.Success(payload), state)
    }
    case AT.FETCH_LOGS_FAILURE: {
      return assoc('logs', RD.Failed(payload), state)
    }
    case AT.FETCH_PRICE_INDEX_SERIES_LOADING: {
      return assoc('price_index_series', RD.Loading(), state)
    }
    case AT.FETCH_PRICE_INDEX_SERIES_SUCCESS: {
      return assoc('price_index_series', RD.Success(payload), state)
    }
    case AT.FETCH_PRICE_INDEX_SERIES_FAILURE: {
      return assoc('price_index_series', RD.Failed(payload), state)
    }
    default:
      return state
  }
}

export default miscReducer
