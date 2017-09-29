import * as AT from './actionTypes'
import { assign } from 'services/RamdaCookingBook'

const INITIAL_STATE = {
  price_index_series: []
}

const charts = (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.FETCH_PRICE_INDEX_SERIES_SUCCESS: {
      const { data } = payload
      return assign(state, { price_index_series: data })
    }
    default:
      return state
  }
}

export default charts
