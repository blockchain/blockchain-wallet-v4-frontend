import * as AT from './actionTypes'

export const reportBalanceStats = () => ({
  type: AT.REPORT_BALANCE_STATS
})
export const logLeftNavClick = text => ({
  type: AT.LOG_LEFT_NAV_CLICK,
  payload: { text }
})
export const logClick = name => ({
  type: AT.LOG_CLICK,
  payload: { name }
})
