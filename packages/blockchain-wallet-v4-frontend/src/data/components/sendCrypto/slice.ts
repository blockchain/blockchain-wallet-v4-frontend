/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import Remote from 'blockchain-wallet-v4/src/remote/remote'
import { ModalOriginType } from 'data/modals/types'

import { SendCryptoState, SendCryptoStepPayload, SendCryptoStepType } from './types'

const initialState: SendCryptoState = {
  step: SendCryptoStepType.COIN_SELECTION
}

const sendCryptoSlice = createSlice({
  initialState,
  name: 'sendCrypto',
  reducers: {
    setStep: (state, action: PayloadAction<SendCryptoStepPayload>) => {
      state.step = action.payload.step
    }
    // showModal: (state, action: PayloadAction<{ origin: ModalOriginType }>) => {}
  }
})

const { actions, reducer } = sendCryptoSlice
export { actions, reducer }
