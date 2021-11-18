/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import Remote from '@core/remote'

import * as T from './types'

const INITIAL_STATE: T.WalletConnectState = {
  sessionDetails: undefined,
  step: Remote.NotAsked,
  uri: ''
}

const walletConnectSlice = createSlice({
  initialState: INITIAL_STATE,
  name: 'walletConnect',
  reducers: {
    handleSessionCallRequest: (state, action: PayloadAction<T.RequestMessagePayload>) => {},
    handleSessionDisconnect: (state, action) => {},
    handleSessionRequest: (state, action) => {},
    initWalletConnect: (state, action: PayloadAction<string>) => {},
    renewRpcConnection: (state, action: PayloadAction<any>) => {}, // TODO change any
    respondToSessionRequest: (state, action: PayloadAction<T.RespondToSessionRequestPayload>) => {},
    respondToTxSendRequest: (state, action: PayloadAction<T.RespondToTxSendRequestPayload>) => {},
    setLocalStorage: (state, action) => {
      if (state.sessionDetails && state.uri) {
        // eslint-disable-next-line no-console
        console.log('Setting local storage')
        const walletConnect = localStorage.getItem('WalletConnect')

        let walletConnectObj = []
        if (walletConnect) {
          const walletConnectObjRaw = JSON.parse(walletConnect)
          walletConnectObj = walletConnectObjRaw.filter((session) => {
            return (
              JSON.stringify(session.sessionDetails.peerMeta) !==
              JSON.stringify(state.sessionDetails?.peerMeta)
            )
          })
        }
        localStorage.setItem(
          'WalletConnect',
          JSON.stringify([
            ...walletConnectObj,
            {
              sessionDetails: state.sessionDetails,
              uri: state.uri
            }
          ])
        )
      }
    },
    setSessionDetails: (state, action: PayloadAction<T.SessionDetailsType>) => {
      state.sessionDetails = action.payload
    },
    setStep: (state, action: PayloadAction<T.WalletConnectStepPayload>) => {
      state.step = Remote.Success({
        data: action.payload?.data,
        error: action.payload?.error,
        name: action.payload?.name
      })
    },
    setUri: (state, action: PayloadAction<string>) => {
      state.uri = action.payload
    }
  }
})

const { actions } = walletConnectSlice
const walletConnectReducer = walletConnectSlice.reducer
export { actions, walletConnectReducer }
