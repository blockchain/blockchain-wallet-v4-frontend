import * as AT from './actionTypes'

let assign = (state, next) => Object.assign({}, state, next)

const INITIAL_STATE = {
  advancedSecurityDisplayed: false,
  bitcoinDisplayed: true,
  dropdownLanguageDisplayed: false,
  headerMenuDisplayed: false,
  navigationDisplayed: false,
  securityCenterMenuDisplayed: false
}

const ui = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case AT.SHOW_SECURITY_CENTER_MENU: {
      return assign(INITIAL_STATE, { securityCenterMenuDisplayed: true })
    }
    case AT.HIDE_SECURITY_CENTER_MENU: {
      return assign(INITIAL_STATE, { securityCenterMenuDisplayed: false })
    }
    case AT.TOGGLE_SECURITY_CENTER_MENU: {
      return assign(INITIAL_STATE, { securityCenterMenuDisplayed: !state.securityCenterMenuDisplayed })
    }
    case AT.TOGGLE_CURRENCY_DISPLAY: {
      return assign(INITIAL_STATE, { bitcoinDisplayed: !state.bitcoinDisplayed })
    }
    case AT.TOGGLE_HEADER_MENU: {
      return assign(INITIAL_STATE, { headerMenuDisplayed: !state.headerMenuDisplayed })
    }
    case AT.TOGGLE_DROPDOWN_LANGUAGE: {
      return assign(INITIAL_STATE, { dropdownLanguageDisplayed: !state.dropdownLanguageDisplayed })
    }
    case AT.TOGGLE_ADVANCED_SECURITY: {
      return assign(INITIAL_STATE, { advancedSecurityDisplayed: !state.advancedSecurityDisplayed })
    }
    default:
      return state
  }
}

export default ui
