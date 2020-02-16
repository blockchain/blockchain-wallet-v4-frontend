import * as AT from './actionTypes'

export const layoutWalletMenuToggleClicked = () => ({
  type: AT.LAYOUT_WALLET_MENU_TOGGLE_CLICKED
})

export const layoutWalletMenuCloseClicked = () => ({
  type: AT.LAYOUT_WALLET_MENU_CLOSE_CLICKED
})

export const setBalancesTableTab = payload => ({
  type: AT.SET_BALANCES_CHART_TAB,
  payload
})
