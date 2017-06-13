import * as actions from './actions'

let assign = (state, next) => Object.assign({}, state, next)

const INITIAL_STATE = {
  bitcoinDisplayed: true,
  exploreMenuDisplayed: false,
  securityCenterMenuDisplayed: false,
  navigationDisplayed: false
}

const header = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case actions.HEADER_SHOW_EXPLORE: {
      return assign(INITIAL_STATE, { exploreMenuDisplayed: true })
    }
    case actions.HEADER_HIDE_EXPLORE: {
      return assign(INITIAL_STATE, { exploreMenuDisplayed: false })
    }
    case actions.HEADER_TOGGLE_EXPLORE: {
      return assign(INITIAL_STATE, { exploreMenuDisplayed: !state.exploreMenuDisplayed })
    }
    case actions.MENU_LEFT_SHOW_SECURITY_CENTER: {
      return assign(INITIAL_STATE, { securityCenterMenuDisplayed: true })
    }
    case actions.MENU_LEFT_HIDE_SECURITY_CENTER: {
      return assign(INITIAL_STATE, { securityCenterMenuDisplayed: false })
    }
    case actions.MENU_LEFT_TOGGLE_SECURITY_CENTER: {
      return assign(INITIAL_STATE, { securityCenterMenuDisplayed: !state.securityCenterMenuDisplayed })
    }
    case actions.TOGGLE_CURRENCY_DISPLAY: {
      return assign(INITIAL_STATE, { bitcoinDisplayed: !state.bitcoinDisplayed })
    }
    default:
      return state
  }
}

export default header
