import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { CoinType } from '@core/types'
import { ToastNatureType } from 'blockchain-info-components'

import { AlertsState, AlertType } from './types'

const initialState: AlertsState = []
const generateId = () => Math.random().toString(36).substring(2, 10)

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
    showAlerts: {
      prepare: (
        nature: ToastNatureType,
        message: string,
        data?: any,
        persist?: boolean,
        coin?: CoinType
      ) => {
        return { payload: { coin, data, id: generateId(), message, nature, persist } }
      },
      reducer: (state, action: PayloadAction<AlertType>) => {
        return state.concat(action.payload)
      }
    }
  }
})

const displayWarning = (message: string, data?: any, persist?: boolean) =>
  alertsSlice.actions.showAlerts(ToastNatureType.WARN, message, data, persist)

const displayInfo = (message: string, data?: any, persist?: boolean) =>
  alertsSlice.actions.showAlerts(ToastNatureType.INFO, message, data, persist)

const displaySuccess = (message: string, data?: any, persist?: boolean) =>
  alertsSlice.actions.showAlerts(ToastNatureType.SUCCESS, message, data, persist)

const displayError = (message: string, data?: any, persist?: boolean, coin?: CoinType) =>
  alertsSlice.actions.showAlerts(ToastNatureType.ERROR, message, data, persist, coin)

export const actions = {
  ...alertsSlice.actions,
  displayError,
  displayInfo,
  displaySuccess,
  displayWarning
}

export const alertsReducer = alertsSlice.reducer
