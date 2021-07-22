/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { ModalOriginType } from 'data/modals/types'
import Remote from 'blockchain-wallet-v4/src/remote/remote'

import { RecurringBuyRegisteredList, RecurringBuyPeriods, RecurringBuyState, RecurringBuyStepPayload, RecurringBuyStepType } from './types'

const initialState: RecurringBuyState = {
  active: undefined,
  methods: Remote.NotAsked,
  period: RecurringBuyPeriods.ONE_TIME,
  registeredList: Remote.NotAsked,
  step: RecurringBuyStepType.INIT_PAGE,
}

const recurringBuySlice = createSlice({
  initialState,
  name: 'recurringBuy',
  reducers: {
    setActive: (state, action: PayloadAction<RecurringBuyRegisteredList>) => {
      state.active = action.payload
    },
    createRecurringBuy: () => {},
    fetchMethods: () => {},
    fetchRegisteredList: () => {},
    methodsLoading: (state) => {
      state.methods = Remote.Loading
    },
    methodsSuccess: (state, action: PayloadAction<RecurringBuyPeriods[]>) => {
      state.methods = Remote.Success(action.payload)
    },
    methodsFailure: (state, action: PayloadAction<string>) => {
      state.methods = Remote.Failure(action.payload)
    },
    registeredListLoading: (state) => {
      state.registeredList = Remote.Loading
    },
    registeredListSuccess: (state, action: PayloadAction<RecurringBuyRegisteredList[]>) => {
      state.registeredList = Remote.Success(action.payload)
    },
    registeredListFailure: (state, action: PayloadAction<string>) => {
      state.registeredList = Remote.Failure(action.payload)
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
