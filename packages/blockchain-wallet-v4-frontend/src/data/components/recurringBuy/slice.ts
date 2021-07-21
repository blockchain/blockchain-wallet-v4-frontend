/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { ModalOriginType } from 'data/modals/types'
import Remote from 'blockchain-wallet-v4/src/remote/remote'

import { RecurringBuyPeriods, RecurringBuyState, RecurringBuyStepPayload, RecurringBuyStepType } from './types'

const initialState: RecurringBuyState = {
  step: RecurringBuyStepType.INIT_PAGE,
  methods: Remote.NotAsked,
  period: RecurringBuyPeriods.ONE_TIME
}

const recurringBuySlice = createSlice({
  initialState,
  name: 'recurringBuy',
  reducers: {
    fetchMethods: () => {},
    methodsLoading: (state) => {
      state.methods = Remote.Loading
    },
    methodsSuccess: (state, action: PayloadAction<RecurringBuyPeriods[]>) => {
      state.methods = Remote.Success(action.payload)
    },
    methodsFailure: (state, action: PayloadAction<string>) => {
      state.methods = Remote.Failure(action.payload)
    },
    setPeriod: (state, action: PayloadAction<RecurringBuyPeriods>) => {
      state.period = action.payload
    },
    setStep: (state, action: PayloadAction<RecurringBuyStepPayload>) => {
      state.step = action.payload.step
    },
    showModal: (state, action: PayloadAction<{ origin: ModalOriginType }>) => {}
  }
})

const { actions, reducer } = recurringBuySlice
export { actions, reducer }
