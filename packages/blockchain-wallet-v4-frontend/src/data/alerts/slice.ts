import { createAction, createSlice } from '@reduxjs/toolkit'
import { prepend } from 'ramda'

import { CoinType } from 'blockchain-wallet-v4/src/types'

import { AlertNatureType, AlertsState } from './types'

const initialState: AlertsState = []
const generateId = () => Math.random().toString(36).substr(2, 10)

const alertsSlice = createSlice({
  initialState,
  name: 'alerts',
  reducers: {
    clearAlerts: () => {
      return []
    },
    dismissAlert: (state, action) => {
      return state.filter((alert) => alert.id !== action.payload)
    },
    showAlerts: (state, action) => {
      return prepend({ ...action.payload }, state)
    }
  }
})

const display = createAction(
  'alerts/showAlerts',
  function prepare(
    nature: AlertNatureType,
    message: string,
    data: any,
    persist?: boolean,
    coin?: CoinType
  ) {
    return {
      payload: { coin, data, id: generateId(), message, nature, persist }
    }
  }
)

const displayWarning = (message: string, data?: any, persist?: boolean) =>
  display('warn', message, data, persist)

const displayInfo = (message: string, data?: any, persist?: boolean) =>
  display('info', message, data, persist)

const displaySuccess = (message: string, data?: any, persist?: boolean) =>
  display('success', message, data, persist)

const displayError = (message: string, data?: any, persist?: boolean, coin?: CoinType) =>
  display('error', message, data, persist, coin)

export const actions = {
  ...alertsSlice.actions,
  displayError,
  displayInfo,
  displaySuccess,
  displayWarning
}
export const { clearAlerts, dismissAlert, showAlerts } = actions

export const alertsReducer = alertsSlice.reducer

export { displayError, displayInfo, displaySuccess, displayWarning }
