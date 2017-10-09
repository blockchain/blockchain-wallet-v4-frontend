import * as AT from './actionTypes'
import { assoc } from 'ramda'

const INITIAL_STATE = {
  price_index_series: []
}

const charts = (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.SET_PRICE_INDEX_SERIES: {
      const { data } = payload
      return assoc('price_index_series', data, state)
    }
    default:
      return state
  }
}

export default charts
