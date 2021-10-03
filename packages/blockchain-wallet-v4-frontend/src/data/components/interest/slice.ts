import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { append, assoc, compose, dropLast, lensProp, over } from 'ramda'

import {
  InterestAccountBalanceType,
  InterestAccountType,
  InterestAfterTransactionType,
  InterestEDDStatus,
  InterestEligibleType,
  InterestInstrumentsResponseType,
  InterestLimitsType,
  InterestRateType,
  InterestTransactionType,
  WithdrawalMinimumTypeResponse,
  WithdrawLimits
} from 'blockchain-wallet-v4/src/network/api/interest/types'
import Remote from 'blockchain-wallet-v4/src/remote/remote'
import { CoinType, FiatType, PaymentValue, WalletFiatType } from 'blockchain-wallet-v4/src/types'

import {
  ErrorStringType,
  InterestLimits,
  InterestMinMaxType,
  InterestState,
  InterestStep,
  InterestStepMetadata
} from './types'

const initialState: InterestState = {
  account: Remote.NotAsked,
  accountBalance: Remote.NotAsked,
  afterTransaction: Remote.NotAsked,
  coin: 'BTC',
  depositLimits: {
    maxCoin: 0,
    maxFiat: 0,
    minCoin: 0,
    minFiat: 0
  },
  instruments: Remote.NotAsked,
  interestEDDStatus: Remote.NotAsked,
  interestEDDWithdrawLimits: Remote.NotAsked,
  interestEligible: Remote.NotAsked,
  interestLimits: Remote.NotAsked,
  interestRate: Remote.NotAsked,
  isAmountDisplayedInCrypto: false,
  payment: Remote.NotAsked,
  step: {
    data: {},
    name: 'ACCOUNT_SUMMARY'
  },
  transactions: [],
  transactionsNextPage: null,
  transactionsReport: Remote.NotAsked,
  withdrawalMinimums: Remote.NotAsked
}

const interestSlice = createSlice({
  initialState,
  name: 'brokerage',
  reducers: {
    clearInterestTransactionsReport: () => {},
    fetchEDDStatus: () => {},

    fetchEDDStatusFailure: (state, action: PayloadAction<ErrorStringType>) => {
      state.interestEDDStatus = Remote.Failure(action.payload.error)
    },
    fetchEDDStatusLoading: (state) => {
      state.interestEDDStatus = Remote.Loading
    },
    fetchEDDStatusSuccess: (state, action: PayloadAction<{ eddStatus: InterestEDDStatus }>) => {
      state.interestEDDStatus = Remote.Success(action.payload.eddStatus)
    },
    // eslint-disable-next-line
    fetchEDDWithdrawLimits: (state, action: PayloadAction<{ currency: FiatType }>) => {},
    fetchEDDWithdrawLimitsFailure: (state, action: PayloadAction<ErrorStringType>) => {
      state.interestEDDWithdrawLimits = Remote.Failure(action.payload.error)
    },
    fetchEDDWithdrawLimitsLoading: (state) => {
      state.interestEDDWithdrawLimits = Remote.Loading
    },
    fetchEDDWithdrawLimitsSuccess: (
      state,
      action: PayloadAction<{ interestEDDWithdrawLimits: WithdrawLimits }>
    ) => {
      state.interestEDDWithdrawLimits = Remote.Success(action.payload.interestEDDWithdrawLimits)
    },

    // ACCOUNT
    // eslint-disable-next-line
    fetchInterestAccount: (state, action: PayloadAction<{coin?: CoinType}>) => {},
    fetchInterestAccountFailure: (state, action: PayloadAction<string>) => {
      state.account = Remote.Failure(action.payload)
    },
    fetchInterestAccountLoading: (state) => {
      state.account = Remote.Loading
    },
    fetchInterestAccountSuccess: (state, action: PayloadAction<InterestAccountType>) => {
      state.account = Remote.Success(action.payload)
    },

    // BALANCES
    fetchInterestBalance: () => {},
    fetchInterestBalanceFailure: (state, action: PayloadAction<string>) => {
      state.accountBalance = Remote.Failure(action.payload)
    },
    fetchInterestBalanceLoading: (state) => {
      state.accountBalance = Remote.Loading
    },
    fetchInterestBalanceSuccess: (state, action: PayloadAction<InterestAccountBalanceType>) => {
      state.accountBalance = Remote.Success(action.payload)
    },

    // ELIGIBLE
    fetchInterestEligible: () => {},
    fetchInterestEligibleFailure: (state, action: PayloadAction<string>) => {
      state.interestEligible = Remote.Failure(action.payload)
    },
    fetchInterestEligibleLoading: (state) => {
      state.interestEligible = Remote.Loading
    },
    fetchInterestEligibleSuccess: (state, action: PayloadAction<InterestEligibleType>) => {
      state.interestEligible = Remote.Success(action.payload)
    },

    // INSTRUMENTS
    fetchInterestInstruments: () => {},
    fetchInterestInstrumentsFailure: (state, action: PayloadAction<string>) => {
      state.instruments = Remote.Failure(action.payload)
    },
    fetchInterestInstrumentsLoading: (state) => {
      state.instruments = Remote.Loading
    },
    fetchInterestInstrumentsSuccess: (
      state,
      action: PayloadAction<{ interestInstruments: InterestInstrumentsResponseType }>
    ) => {
      state.instruments = Remote.Success(action.payload.interestInstruments.instruments)
    },

    // LIMITS
    fetchInterestLimits: (
      // eslint-disable-next-line
      state,
      // eslint-disable-next-line
      action: PayloadAction<InterestLimits>
    ) => {},
    fetchInterestLimitsFailure: (state, action: PayloadAction<string>) => {
      state.interestLimits = Remote.Failure(action.payload)
    },
    fetchInterestLimitsLoading: (state) => {
      state.interestLimits = Remote.Loading
    },
    fetchInterestLimitsSuccess: (state, action: PayloadAction<InterestLimitsType>) => {
      state.interestLimits = Remote.Success(action.payload)
    },

    // INTEREST RATES
    fetchInterestRate: () => {},
    fetchInterestRateFailure: (state, action: PayloadAction<string>) => {
      state.interestRate = Remote.Failure(action.payload)
    },
    fetchInterestRateLoading: (state) => {
      state.interestRate = Remote.Loading
    },
    fetchInterestRateSuccess: (state, action: PayloadAction<InterestRateType>) => {
      state.interestRate = Remote.Success(action.payload.rates)
    },

    fetchInterestTransactions: (
      // eslint-disable-next-line
      state,
      // eslint-disable-next-line
      action: PayloadAction<{ coin?: CoinType; reset: boolean }>
    ) => {},
    fetchInterestTransactionsFailure: (state, action: PayloadAction<string>) => {
      const newState = assoc('transactions', [Remote.Failure(action.payload)], state)
      state.transactions = newState.transactions
    },
    fetchInterestTransactionsLoading: (state, action: PayloadAction<{ reset: boolean }>) => {
      const { reset } = action.payload
      if (reset) {
        const newState = assoc('transactions', [Remote.Loading], state)
        state.transactions = newState.transactions
      } else {
        const newState = over(lensProp('transactions'), append(Remote.Loading), state)
        state.transactions = newState.transactions
      }
    },
    // eslint-disable-next-line
    fetchInterestTransactionsReport: () => {},

    fetchInterestTransactionsReportFailure: (state, action: PayloadAction<string>) => {
      state.transactionsReport = Remote.Failure(action.payload)
    },
    fetchInterestTransactionsReportLoading: (state) => {
      state.transactionsReport = Remote.Loading
    },
    fetchInterestTransactionsReportSuccess: (
      state,
      action: PayloadAction<InterestTransactionType[]>
    ) => {
      state.transactionsReport = Remote.Success(action.payload)
    },

    fetchInterestTransactionsSuccess: (
      state,
      action: PayloadAction<{ reset: boolean; transactions: Array<InterestTransactionType> }>
    ) => {
      const { reset, transactions } = action.payload
      if (reset) {
        const newState = assoc('transactions', [Remote.Success(transactions)], state)
        state.transactions = newState.transactions
      } else {
        const newState = over(
          lensProp('transactions'),
          compose(
            // @ts-ignore
            append(Remote.Success(transactions)),
            dropLast(1)
          ),
          state
        )
        state.transactions = newState.transactions
      }
    },

    fetchShowInterestCardAfterTransaction: (
      // eslint-disable-next-line
      state,
      // eslint-disable-next-line
      actions: PayloadAction<{ currency?: WalletFiatType }>
    ) => {},

    fetchShowInterestCardAfterTransactionFailure: (
      state,
      action: PayloadAction<{ error: string }>
    ) => {
      state.afterTransaction = Remote.Failure(action.payload.error)
    },

    fetchShowInterestCardAfterTransactionLoading: (state) => {
      state.afterTransaction = Remote.Loading
    },

    fetchShowInterestCardAfterTransactionSuccess: (
      state,
      action: PayloadAction<{ afterTransaction: InterestAfterTransactionType }>
    ) => {
      state.afterTransaction = Remote.Success(action.payload.afterTransaction)
    },

    handleTransferMaxAmountClick: (
      // eslint-disable-next-line
      state,
      // eslint-disable-next-line
      action: PayloadAction<{ amount: number; coin: 'FIAT' | CoinType }>
    ) => {},
    handleTransferMinAmountClick: (
      // eslint-disable-next-line
      state,
      // eslint-disable-next-line
      action: PayloadAction<{ amount: number; coin: 'FIAT' | CoinType }>
    ) => {},
    // eslint-disable-next-line
    handleWithdrawalSupplyInformation: (state, action: PayloadAction<{ origin: string }>) => {},

    initializeDepositForm: (
      state,
      action: PayloadAction<{ coin: CoinType; currency: FiatType }>
    ) => {
      state.coin = action.payload.coin
    },

    initializeDepositModal: () => {},

    initializeWithdrawalForm: (
      // eslint-disable-next-line
      state,
      // eslint-disable-next-line
      action: PayloadAction<{ coin: CoinType; walletCurrency: FiatType }>
    ) => {},
    requestWithdrawal: (
      // eslint-disable-next-line
      state,
      // eslint-disable-next-line
      action: PayloadAction<{
        coin: CoinType
        withdrawalAmountCrypto: number
        withdrawalAmountFiat: number
      }>
    ) => {},

    resetShowInterestCardAfterTransaction: (state) => {
      state.afterTransaction = Remote.NotAsked
    },
    // eslint-disable-next-line
    routeToTxHash: (state, action: PayloadAction<{ coin: CoinType; txHash?: string }>) => {},

    setCoinDisplay: (state, action: PayloadAction<{ isAmountDisplayedInCrypto: boolean }>) => {
      state.isAmountDisplayedInCrypto = action.payload.isAmountDisplayedInCrypto
    },

    setDepositLimits: (state, action: PayloadAction<{ limits: InterestMinMaxType }>) => {
      state.depositLimits = action.payload.limits
    },

    setInterestStep: (
      state,
      action: PayloadAction<{ data?: InterestStepMetadata; name: InterestStep }>
    ) => {
      const { data, name } = action.payload
      state.step = {
        data: data || {},
        name
      }
    },

    setPaymentFailure: (state, action: PayloadAction<{ error: string }>) => {
      state.payment = Remote.Failure(action.payload.error)
    },
    setPaymentLoading: (state) => {
      state.payment = Remote.Loading
    },

    setPaymentSuccess: (state, action: PayloadAction<{ payment?: PaymentValue }>) => {
      state.payment = Remote.Success(action.payload.payment)
    },

    setTransactionsNextPage: (state, action: PayloadAction<{ nextPage: string | null }>) => {
      state.transactionsNextPage = action.payload.nextPage
    },
    setWithdrawalMinimumsFailure: (state, action: PayloadAction<ErrorStringType>) => {
      state.withdrawalMinimums = Remote.Failure(action.payload.error)
    },
    setWithdrawalMinimumsLoading: (state) => {
      state.withdrawalMinimums = Remote.Loading
    },
    setWithdrawalMinimumsSuccess: (
      state,
      action: PayloadAction<{ withdrawalMinimumsResponse: WithdrawalMinimumTypeResponse }>
    ) => {
      state.withdrawalMinimums = Remote.Success(
        action.payload.withdrawalMinimumsResponse.minAmounts
      )
    },

    showInterestModal: (state, action: PayloadAction<{ coin: CoinType; step: InterestStep }>) => {
      state.coin = action.payload.coin
    },

    stopShowingInterestModal: () => {},
    // eslint-disable-next-line
    submitDepositForm: (state, action: PayloadAction<{ coin: CoinType }>) => {}
  }
})

export const {
  clearInterestTransactionsReport,
  fetchEDDStatus,
  fetchEDDStatusFailure,
  fetchEDDStatusLoading,
  fetchEDDStatusSuccess,
  fetchEDDWithdrawLimits,
  fetchEDDWithdrawLimitsFailure,
  fetchEDDWithdrawLimitsLoading,
  fetchEDDWithdrawLimitsSuccess,
  fetchInterestAccount,
  fetchInterestAccountFailure,
  fetchInterestAccountLoading,
  fetchInterestAccountSuccess,
  fetchInterestBalance,
  fetchInterestBalanceFailure,
  fetchInterestBalanceLoading,
  fetchInterestBalanceSuccess,
  fetchInterestEligible,
  fetchInterestEligibleFailure,
  fetchInterestEligibleLoading,
  fetchInterestEligibleSuccess,
  fetchInterestInstruments,
  fetchInterestInstrumentsFailure,
  fetchInterestInstrumentsLoading,
  fetchInterestInstrumentsSuccess,
  fetchInterestLimits,
  fetchInterestLimitsFailure,
  fetchInterestLimitsLoading,
  fetchInterestLimitsSuccess,
  fetchInterestRate,
  fetchInterestRateFailure,
  fetchInterestRateLoading,
  fetchInterestRateSuccess,
  fetchInterestTransactions,
  fetchInterestTransactionsFailure,
  fetchInterestTransactionsLoading,
  fetchInterestTransactionsReport,
  fetchInterestTransactionsReportFailure,
  fetchInterestTransactionsReportLoading,
  fetchInterestTransactionsReportSuccess,
  fetchInterestTransactionsSuccess,
  fetchShowInterestCardAfterTransaction,
  fetchShowInterestCardAfterTransactionFailure,
  fetchShowInterestCardAfterTransactionLoading,
  fetchShowInterestCardAfterTransactionSuccess,
  handleTransferMaxAmountClick,
  handleTransferMinAmountClick,
  handleWithdrawalSupplyInformation,
  initializeDepositForm,
  initializeDepositModal,
  initializeWithdrawalForm,
  requestWithdrawal,
  resetShowInterestCardAfterTransaction,
  routeToTxHash,
  setCoinDisplay,
  setDepositLimits,
  setInterestStep,
  setPaymentFailure,
  setPaymentLoading,
  setPaymentSuccess,
  setTransactionsNextPage,
  setWithdrawalMinimumsFailure,
  setWithdrawalMinimumsLoading,
  setWithdrawalMinimumsSuccess,
  showInterestModal,
  stopShowingInterestModal,
  submitDepositForm
} = interestSlice.actions

const { actions } = interestSlice
const interestReducer = interestSlice.reducer
export { actions, interestReducer }
