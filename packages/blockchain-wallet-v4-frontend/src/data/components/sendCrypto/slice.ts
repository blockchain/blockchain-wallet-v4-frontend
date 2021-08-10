/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import Remote from 'blockchain-wallet-v4/src/remote/remote'
import { WithdrawalMinsAndFeesResponse } from 'core/types'

import { SendCryptoState, SendCryptoStepPayload, SendCryptoStepType } from './types'

const initialState: SendCryptoState = {
  step: SendCryptoStepType.COIN_SELECTION,
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
    setStep: (state, action: PayloadAction<SendCryptoStepPayload>) => {
      state.step = action.payload.step
    }
    // showModal: (state, action: PayloadAction<{ origin: ModalOriginType }>) => {}
  }
})

const { actions, reducer } = sendCryptoSlice
export { actions, reducer }
