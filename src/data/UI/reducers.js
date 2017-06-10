import * as AT from 'data/actionTypes'

let assign = (state, next) => Object.assign({}, state, next)

const INITIAL_STATE = {
  bitcoinDisplayed: true,
  exploreMenuDisplayed: false,
  securityCenterMenuDisplayed: false,
  navigationDisplayed: false
}

const header = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case AT.HEADER_SHOW_EXPLORE: {
      return assign(INITIAL_STATE, { exploreMenuDisplayed: true })
    }
    case AT.HEADER_HIDE_EXPLORE: {
      return assign(INITIAL_STATE, { exploreMenuDisplayed: false })
    }
    case AT.HEADER_TOGGLE_EXPLORE: {
      return assign(INITIAL_STATE, { exploreMenuDisplayed: !state.exploreMenuDisplayed })
    }
    case AT.MENU_LEFT_SHOW_SECURITY_CENTER: {
      return assign(INITIAL_STATE, { securityCenterMenuDisplayed: true })
    }
    case AT.MENU_LEFT_HIDE_SECURITY_CENTER: {
      return assign(INITIAL_STATE, { securityCenterMenuDisplayed: false })
    }
    case AT.MENU_LEFT_TOGGLE_SECURITY_CENTER: {
      return assign(INITIAL_STATE, { securityCenterMenuDisplayed: !state.securityCenterMenuDisplayed })
    }
    case AT.TOGGLE_CURRENCY_DISPLAY: {
      return assign(INITIAL_STATE, { bitcoinDisplayed: !state.bitcoinDisplayed })
    }
    default:
      return state
  }
}

export default header
