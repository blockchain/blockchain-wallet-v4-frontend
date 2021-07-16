/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { ModalNamesType, ModalOriginType } from 'data/modals/types'

import { RecurringBuyState, RecurringBuyStepPayload, RecurringBuyStepType } from './types'

const initialState: RecurringBuyState = {
  step: RecurringBuyStepType.INIT_PAGE
}

const recurringBuySlice = createSlice({
  initialState,
  name: 'recurringBuy',
  reducers: {
    setStep: (state, action: PayloadAction<RecurringBuyStepPayload>) => {
      state.step = action.payload.step
    },
    showModal: (state, action: PayloadAction<{ origin: ModalOriginType }>) => {}
  }
})

const { actions, reducer } = recurringBuySlice
export { actions, reducer }
