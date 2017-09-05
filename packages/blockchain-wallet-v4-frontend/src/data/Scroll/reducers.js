import * as AT from './actionTypes'
import { assign } from 'services/RamdaCookingBook'

const INITIAL_STATE = {
  xOffset: 0,
  yOffset: 0,
  xMax: 0,
  yMax: 0
}

const scroll = (state = INITIAL_STATE, action) => {
  const { type, payload } = action

  switch (type) {
    case AT.UPDATE_SCROLL: {
      return assign(INITIAL_STATE, payload)
    }
    case AT.RESET_SCROLL: {
      return INITIAL_STATE
    }
    default:
      return state
  }
}

export default scroll
