
import { HEADER_SHOW_EXPLORE, HEADER_HIDE_EXPLORE, HEADER_TOGGLE_EXPLORE } from '../actionTypes'

let assign = (state, next) => Object.assign({}, state, next)

const INITIAL_STATE = {
  exploreMenuDisplayed: false
}

const header = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case HEADER_SHOW_EXPLORE: {
      return assign(INITIAL_STATE, { exploreMenuDisplayed: true })
    }
    case HEADER_HIDE_EXPLORE: {
      return assign(INITIAL_STATE, { exploreMenuDisplayed: false })
    }
    case HEADER_TOGGLE_EXPLORE: {
      return assign(INITIAL_STATE, { exploreMenuDisplayed: !state.exploreMenuDisplayed })
    }
    default:
      return state
  }
}

export default header
