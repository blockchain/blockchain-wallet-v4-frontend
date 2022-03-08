import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { dissoc, mergeRight } from 'ramda'

import {
  ExchangeSessionType,
  SessionStatePOCType,
  SessionStateType,
  WalletSessionType
} from './types'

const initialState: SessionStatePOCType = {
  exchange: undefined,
  wallet: undefined
}

const sessionSlice = createSlice({
  initialState,
  name: 'session',
  reducers: {
    // saveSession: (state, action: PayloadAction<{ [key: string]: string }>) => {
    //   return mergeRight(state, action.payload)
    // },
    clearSessions: (state) => {
      state = { exchange: undefined, wallet: undefined }
    },

    deauthorizeBrowser: () => {},

    logout: () => {},

    logoutClearReduxStore: () => {},

    removeSession: (state, action: PayloadAction<string>) => {
      dissoc(action.payload, state)
    },
    saveExchangeSession: (state, action: PayloadAction<ExchangeSessionType>) => {
      state.exchange = action.payload
    },
    saveWalletSession: (state, action: PayloadAction<WalletSessionType>) => {
      state.wallet = action.payload
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
