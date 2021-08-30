/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import Remote from 'blockchain-wallet-v4/src/remote/remote'
import {
  // ProductTypes,
  // SBTransactionType,
  WithdrawalLockResponseType,
  WithdrawalMinsAndFeesResponse,
  WithdrawResponseType
} from 'core/types'

import { SendCryptoState, SendCryptoStepPayload, SendCryptoStepType } from './types'

const initialState: SendCryptoState = {
  initialCoin: undefined,
  step: SendCryptoStepType.COIN_SELECTION,
  transaction: Remote.NotAsked,
  withdrawLocks: Remote.NotAsked,
  withdrawalFeesAndMins: Remote.NotAsked
}

const sendCryptoSlice = createSlice({
  initialState,
  name: 'sendCrypto',
  reducers: {
    fetchWithdrawalFees: () => {},
    fetchWithdrawalFeesFailure: (state, action: PayloadAction<string>) => {
      state.withdrawalFeesAndMins = Remote.Failure(action.payload)
    },
    fetchWithdrawalFeesLoading: (state) => {
      state.withdrawalFeesAndMins = Remote.Loading
    },
    fetchWithdrawalFeesSuccess: (state, action: PayloadAction<WithdrawalMinsAndFeesResponse>) => {
      state.withdrawalFeesAndMins = Remote.Success(action.payload)
    },
    fetchWithdrawalLocks: () => {},
    fetchWithdrawalLocksFailure: (state, action: PayloadAction<string>) => {
      state.withdrawLocks = Remote.Failure(action.payload)
    },
    fetchWithdrawalLocksLoading: (state) => {
      state.withdrawLocks = Remote.Loading
    },
    fetchWithdrawalLocksSuccess: (state, action: PayloadAction<WithdrawalLockResponseType>) => {
      state.withdrawLocks = Remote.Success(action.payload)
    },
    setInitialCoin: (state, action: PayloadAction<string>) => {
      state.initialCoin = action.payload
    },
    setStep: (state, action: PayloadAction<SendCryptoStepPayload>) => {
      state.step = action.payload.step
    },
    submitTransaction: () => {},
    submitTransactionFailure: (state, action: PayloadAction<string>) => {
      state.transaction = Remote.Failure(action.payload)
    },
    submitTransactionLoading: (state) => {
      state.transaction = Remote.Loading
    },
    submitTransactionSuccess: (state, action: PayloadAction<WithdrawResponseType>) => {
      state.transaction = Remote.Success(action.payload)
    }
    // showModal: (state, action: PayloadAction<{ origin: ModalOriginType }>) => {}
  }
})

const { actions, reducer } = sendCryptoSlice
export { actions, reducer }
