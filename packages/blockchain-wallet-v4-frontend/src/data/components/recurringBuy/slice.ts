import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import Remote from 'blockchain-wallet-v4/src/remote/remote'
import { ModalOriginType } from 'data/modals/types'

import {
  RecurringBuyNextPayment,
  RecurringBuyOrigins,
  RecurringBuyPeriods,
  RecurringBuyRegisteredList,
  RecurringBuyState,
  RecurringBuyStepPayload,
  RecurringBuyStepType
} from './types'

const initialState: RecurringBuyState = {
  active: undefined,
  paymentInfo: Remote.NotAsked,
  period: RecurringBuyPeriods.ONE_TIME,
  registeredList: Remote.NotAsked,
  step: RecurringBuyStepType.INIT_PAGE
}

const recurringBuySlice = createSlice({
  initialState,
  name: 'recurringBuy',
  reducers: {
    createRecurringBuy: () => {},
    fetchPaymentInfo: () => {},
    fetchRegisteredList: () => {},
    infoViewed: (state, action: PayloadAction<number>) => {},
    learnMoreLinkClicked: (state, action: PayloadAction<RecurringBuyOrigins>) => {},
    paymentInfoFailure: (state, action: PayloadAction<string>) => {
      state.paymentInfo = Remote.Failure(action.payload)
    },
    paymentInfoLoading: (state) => {
      state.paymentInfo = Remote.Loading
    },
    paymentInfoSuccess: (state, action: PayloadAction<RecurringBuyNextPayment[]>) => {
      state.paymentInfo = Remote.Success(action.payload)
    },
    registeredListFailure: (state, action: PayloadAction<string>) => {
      state.registeredList = Remote.Failure(action.payload)
    },
    registeredListLoading: (state) => {
      state.registeredList = Remote.Loading
    },
    registeredListSuccess: (state, action: PayloadAction<RecurringBuyRegisteredList[]>) => {
      state.registeredList = Remote.Success(action.payload)
    },
    removeRecurringBuy: (state, action: PayloadAction<RecurringBuyRegisteredList['id']>) => {},
    setActive: (state, action: PayloadAction<RecurringBuyRegisteredList>) => {
      state.active = action.payload
    },
    setPeriod: (state, action: PayloadAction<RecurringBuyPeriods>) => {
      state.period = action.payload
    },
    setStep: (state, action: PayloadAction<RecurringBuyStepPayload>) => {
      state.step = action.payload.step
    },
    showModal: (state, action: PayloadAction<{ origin: ModalOriginType }>) => {},
    suggestionSkipped: (state, action: PayloadAction<RecurringBuyOrigins>) => {},
    viewed: () => {}
  }
})

const { actions, reducer } = recurringBuySlice
export { actions, reducer }
