/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import Remote from '@core/remote'
import {
  CoinType,
  CrossBorderLimits,
  CrossBorderLimitsPyload,
  PaymentValue,
  SwapOrderType,
  SwapQuoteType,
  SwapUserLimitsType
} from '@core/types'
import { ModalOriginType } from 'data/modals/types'

import { SwapAccountType, SwapCheckoutFixType, SwapState, SwapStepPayload } from './types'

const initialState: SwapState = {
  crossBorderLimits: Remote.NotAsked,
  custodialEligibility: Remote.NotAsked,
  fix: 'FIAT',
  limits: Remote.NotAsked,
  order: undefined,
  pairs: Remote.NotAsked,
  payment: Remote.NotAsked,
  quote: Remote.NotAsked,
  side: 'BASE',
  step: 'INIT_SWAP',
  trades: {
    list: [],
    status: Remote.NotAsked
  }
}

const swapSlice = createSlice({
  initialState,
  name: 'swap',
  reducers: {
    cancelOrder: (state, action: PayloadAction<{ id: string }>) => {},
    changeBase: (state, action: PayloadAction<{ account: SwapAccountType }>) => {},
    changeCounter: (state, action: PayloadAction<{ account: SwapAccountType }>) => {},
    changeTrendingPair: (
      state,
      action: PayloadAction<{ baseAccount: SwapAccountType; counterAccount: SwapAccountType }>
    ) => {},
    createOrder: () => {},

    // cross border limits
    fetchCrossBorderLimits: (state, action: PayloadAction<CrossBorderLimitsPyload>) => {},
    fetchCrossBorderLimitsFailure: (state, action: PayloadAction<string>) => {
      state.crossBorderLimits = Remote.Failure(action.payload)
    },
    fetchCrossBorderLimitsLoading: (state) => {
      state.crossBorderLimits = Remote.Loading
    },
    fetchCrossBorderLimitsSuccess: (state, action: PayloadAction<CrossBorderLimits>) => {
      state.crossBorderLimits = Remote.Success(action.payload)
    },

    fetchCustodialEligibility: () => {},
    fetchCustodialEligibilityLoading: (state) => {
      state.custodialEligibility = Remote.Loading
    },
    fetchCustodialEligibilitySuccess: (state, action: PayloadAction<boolean>) => {
      state.custodialEligibility = Remote.Success(action.payload)
    },
    fetchCustodialEligibiliyFailure: (state, action: PayloadAction<string>) => {
      state.custodialEligibility = Remote.Failure(action.payload)
    },

    fetchLimits: () => {},
    fetchLimitsFailure: (state, action: PayloadAction<string>) => {
      state.limits = Remote.Failure(action.payload)
    },
    fetchLimitsLoading: (state) => {
      state.limits = Remote.Loading
    },
    fetchLimitsSuccess: (state, action: PayloadAction<SwapUserLimitsType>) => {
      state.limits = Remote.Success(action.payload)
    },

    fetchPairs: () => {},
    fetchPairsFailure: (state, action: PayloadAction<string>) => {
      state.pairs = Remote.Failure(action.payload)
    },
    fetchPairsLoading: (state) => {
      state.pairs = Remote.Loading
    },
    fetchPairsSuccess: (state, action: PayloadAction<Array<string>>) => {
      state.pairs = Remote.Success(action.payload)
    },

    fetchQuote: () => {},
    fetchQuoteFailure: (state, action: PayloadAction<string>) => {
      state.quote = Remote.Failure(action.payload)
    },
    fetchQuoteLoading: (state) => {
      state.quote = Remote.Loading
    },
    fetchQuoteSuccess: (state, action: PayloadAction<{ quote: SwapQuoteType; rate: number }>) => {
      state.quote = Remote.Success(action.payload)
    },

    fetchTrades: () => {},
    fetchTradesFailure: (state, action: PayloadAction<string>) => {
      state.trades = {
        ...state.trades,
        status: Remote.Failure(action.payload)
      }
    },
    fetchTradesLoading: (state) => {
      state.trades = {
        ...state.trades,
        status: Remote.Loading
      }
    },
    fetchTradesSuccess: (state, action: PayloadAction<Array<SwapOrderType>>) => {
      state.trades = {
        ...state.trades,
        list: [...state.trades.list, ...action.payload],
        status: Remote.Success('Success')
      }
    },
    handleSwapMaxAmountClick: (state, action: PayloadAction<{ amount: string | undefined }>) => {},
    handleSwapMinAmountClick: (state, action: PayloadAction<{ amount: string | undefined }>) => {},
    initAmountForm: () => {},
    refreshAccounts: () => {},
    setCheckoutFix: (state, action: PayloadAction<SwapCheckoutFixType>) => {
      state.fix = action.payload
    },
    setStep: (state, action: PayloadAction<SwapStepPayload>) => {
      switch (action.payload.step) {
        case 'COIN_SELECTION':
          state.side = action.payload.options.side
          state.step = action.payload.step
          break
        case 'SUCCESSFUL_SWAP':
        case 'ORDER_DETAILS':
          state.order = action.payload.options.order
          state.step = action.payload.step
          break
        default: {
          state.step = action.payload.step
          break
        }
      }
    },
    showModal: (
      state,
      action: PayloadAction<{
        baseCurrency?: CoinType
        counterCurrency?: CoinType
        origin: ModalOriginType
      }>
    ) => {},
    startPollQuote: () => {},
    stopPollQuote: () => {},
    switchFix: (state, action: PayloadAction<{ amount: string; fix: SwapCheckoutFixType }>) => {},
    toggleBaseAndCounter: () => {},

    updatePayment: () => {},
    updatePaymentFailure: (state, action: PayloadAction<string>) => {
      state.payment = Remote.Failure(action.payload)
    },
    updatePaymentLoading: (state) => {
      state.payment = Remote.Loading
    },
    updatePaymentSuccess: (state, action: PayloadAction<PaymentValue | undefined>) => {
      state.payment = Remote.Success(action.payload)
    }
  }
})

const { actions, reducer } = swapSlice
const swapSliceReducer = reducer
export { actions, swapSliceReducer }
