import { CoinType } from 'blockchain-wallet-v4/src/types'

import { ALERTS_CLEAR, ALERTS_DISMISS, ALERTS_SHOW } from './actionTypes'
import { AlertNatureType } from './types'

const generateId = () =>
  Math.random()
    .toString(36)
    .substr(2, 10)

const display = (
  nature: AlertNatureType,
  message: string,
  data: any,
  persist?: boolean,
  coin?: CoinType
) => ({
  type: ALERTS_SHOW,
  payload: { id: generateId(), nature, message, data, persist, coin }
})
export const displayWarning = (
  message: string,
  data?: any,
  persist?: boolean
) => display('warn', message, data, persist)

export const displayInfo = (message: string, data?: any, persist?: boolean) =>
  display('info', message, data, persist)

export const displaySuccess = (
  message: string,
  data?: any,
  persist?: boolean
) => display('success', message, data, persist)

export const displayError = (
  message: string,
  data?: any,
  persist?: boolean,
  coin?: CoinType
) => display('error', message, data, persist, coin)

export const clearAlerts = () => ({ type: ALERTS_CLEAR })

export const dismissAlert = id => ({ type: ALERTS_DISMISS, payload: { id } })
