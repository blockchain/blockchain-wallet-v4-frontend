import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { dissoc } from 'ramda'

import { AccountSessionType, SessionStateType } from './types'

const initialState: SessionStateType = {
  exchange: undefined,
  wallet: undefined
}

const sessionSlice = createSlice({
  initialState,
  name: 'session',
  reducers: {
    clearRecoverSession: (state) => {
      state.recover = undefined
    },
    clearSessions: (state) => {
      state.wallet = undefined
      state.exchange = undefined
      state.recover = undefined
    },
    deauthorizeBrowser: () => {},
    logout: () => {},
    logoutClearReduxStore: () => {},
    removeSession: (state, action: PayloadAction<string>) => {
      dissoc(action.payload, state)
    },
    saveExchangeSession: (state, action: PayloadAction<AccountSessionType>) => {
      state.exchange = action.payload
    },
    saveRecoverSession: (state, action: PayloadAction<AccountSessionType>) => {
      state.recover = action.payload
    },
    saveWalletSession: (state, action: PayloadAction<AccountSessionType>) => {
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
