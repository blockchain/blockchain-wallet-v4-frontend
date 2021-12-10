/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IWalletConnectSession } from '@walletconnect/types'

import Remote from '@core/remote'

import * as T from './types'
import { WalletConnectStep } from './types'

const INITIAL_STATE: T.WalletConnectState = {
  sessionDetails: undefined,
  step: Remote.of({ name: WalletConnectStep.LOADING }),
  uri: ''
}

const walletConnectSlice = createSlice({
  initialState: INITIAL_STATE,
  name: 'walletConnect',
  reducers: {
    addNewDappConnection: (state, action) => {},
    handleSessionCallRequest: (state, action: PayloadAction<T.RequestMessagePayload>) => {},
    handleSessionDisconnect: (state, action) => {},
    handleSessionRequest: (state, action) => {},
    initLSWalletConnect: (state, action) => {},
    initWalletConnect: (state, action: PayloadAction<T.InitWalletConnectPayload>) => {},
    launchDappConnection: (state, action: PayloadAction<T.ReuseWalletConnectPayload>) => {},
    removeDappConnection: (state, action: PayloadAction<T.ReuseWalletConnectPayload>) => {},
    respondToSessionRequest: (state, action: PayloadAction<T.RespondToSessionRequestPayload>) => {},
    respondToTxSendRequest: (state, action: PayloadAction<T.RespondToTxSendRequestPayload>) => {},
    setSessionDetails: (state, action: PayloadAction<IWalletConnectSession>) => {
      state.sessionDetails = action.payload
    },
    setStep: (state, action: PayloadAction<T.WalletConnectStepPayload>) => {
      state.step = Remote.Success({
        data: action.payload?.data,
        error: action.payload?.error,
        name: action.payload?.name
      })
    },
    showAddNewDapp: (state, action) => {}
  }
})

const { actions } = walletConnectSlice
const walletConnectReducer = walletConnectSlice.reducer
export { actions, walletConnectReducer }
