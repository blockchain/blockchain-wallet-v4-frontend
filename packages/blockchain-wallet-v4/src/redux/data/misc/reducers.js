import { assoc } from 'ramda'
import * as AT from './actionTypes.js'
import Remote from '../../../remote'

const INITIAL_STATE = {
  adverts: Remote.NotAsked,
  captcha: Remote.NotAsked,
  logs: Remote.NotAsked,
  price_index_series: Remote.NotAsked
}

const miscReducer = (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.FETCH_ADVERTS_LOADING: {
      return assoc('adverts', Remote.Loading, state)
    }
    case AT.FETCH_ADVERTS_SUCCESS: {
      return assoc('adverts', Remote.Success(payload), state)
    }
    case AT.FETCH_ADVERTS_FAILURE: {
      return assoc('adverts', Remote.Failure(payload), state)
    }
    case AT.FETCH_CAPTCHA_LOADING: {
      return assoc('captcha', Remote.Loading, state)
    }
    case AT.FETCH_CAPTCHA_SUCCESS: {
      return assoc('captcha', Remote.Success(payload), state)
    }
    case AT.FETCH_CAPTCHA_FAILURE: {
      return assoc('captcha', Remote.Failure(payload), state)
    }
    case AT.FETCH_LOGS_LOADING: {
      return assoc('logs', Remote.Loading, state)
    }
    case AT.FETCH_LOGS_SUCCESS: {
      return assoc('logs', Remote.Success(payload), state)
    }
    case AT.FETCH_LOGS_FAILURE: {
      return assoc('logs', Remote.Failure(payload), state)
    }
    case AT.FETCH_PRICE_INDEX_SERIES_LOADING: {
      return assoc('price_index_series', Remote.Loading, state)
    }
    case AT.FETCH_PRICE_INDEX_SERIES_SUCCESS: {
      return assoc('price_index_series', Remote.Success(payload), state)
    }
    case AT.FETCH_PRICE_INDEX_SERIES_FAILURE: {
      return assoc('price_index_series', Remote.Failure(payload), state)
    }
    default:
      return state
  }
}

export default miscReducer
