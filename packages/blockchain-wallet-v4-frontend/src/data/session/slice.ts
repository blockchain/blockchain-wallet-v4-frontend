import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { dissoc, mergeRight } from 'ramda'

import {
  ExchangeSessionType,
  SessionStateType,
  SessionStatePOCType,
  WalletSessionType
} from './types'

const initialState: SessionStatePOCType = {
  wallet: [],
  exchange: []
}

const sessionSlice = createSlice({
  initialState,
  name: 'session',
  reducers: {
    deauthorizeBrowser: () => {},
    logout: () => {},
    logoutClearReduxStore: () => {},
    removeSession: (state, action: PayloadAction<string>) => {
      dissoc(action.payload, state)
    },
    // saveSession: (state, action: PayloadAction<{ [key: string]: string }>) => {
    //   return mergeRight(state, action.payload)
    // },
    clearSessions: (state) => {
      return (state = { wallet: [], exchange: [] })
    },
    saveExchangeSession: (state, action: PayloadAction<ExchangeSessionType>) => {
      state.exchange.push(action.payload)
    },
    saveWalletSession: (state, action: PayloadAction<WalletSessionType>) => {
      state.wallet.push(action.payload)
    }
  }
})

export const {
  clearSessions,
  deauthorizeBrowser,
  logout,
  logoutClearReduxStore,
  removeSession,
  saveExchangeSession,
  saveWalletSession
} = sessionSlice.actions

const { actions } = sessionSlice
const sessionReducer = sessionSlice.reducer
export { actions, sessionReducer }
