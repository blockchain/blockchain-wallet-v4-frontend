import { path } from 'ramda'
import * as AT from './actionTypes'

export const reportBalanceStats = () => ({
  type: AT.REPORT_BALANCE_STATS
})
export const logLeftNavClick = event => ({
  type: AT.LOG_LEFT_NAV_CLICK,
  payload: { target: path(['target', 'textContent'], event) }
})
export const logClick = name => ({
  type: AT.LOG_CLICK,
  name
})
