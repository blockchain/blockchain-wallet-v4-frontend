import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { append, assoc, compose, dropLast, lensProp, over } from 'ramda'

import {
  DepositLimits,
  EarnEligibleType,
  InterestAccountBalanceType,
  InterestAccountType,
  InterestAfterTransactionType,
  InterestEDDStatus,
  InterestLimitsType,
  InterestTransactionType,
  RewardsRatesType,
  StakingRatesType,
  WithdrawalMinimumTypeResponse,
  WithdrawLimits
} from '@core/network/api/earn/types'
import Remote from '@core/remote'
import { CoinType, FiatType, PaymentValue, WalletFiatType } from '@core/types'

import {
  EarnInstrumentsType,
  ErrorStringType,
  InterestLimits,
  InterestMinMaxType,
  InterestState,
  InterestStep,
  InterestStepMetadata,
  StakingStep
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
  interestEDDDepositLimits: Remote.NotAsked,
  interestEDDStatus: Remote.NotAsked,
  interestEDDWithdrawLimits: Remote.NotAsked,
  interestEligible: Remote.NotAsked,
  interestLimits: Remote.NotAsked,
  interestRates: Remote.NotAsked,
  isAmountDisplayedInCrypto: false,
  payment: Remote.NotAsked,
  rewardsStep: {
    data: {},
    name: 'ACCOUNT_SUMMARY'
  },
  stakingEligible: Remote.NotAsked,
  stakingRates: Remote.NotAsked,
  stakingStep: {
    data: {},
    name: 'WARNING'
  },
  transactions: [],
  transactionsNextPage: null,
  transactionsReport: Remote.NotAsked,
  underSanctionsMessage: null,
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
    // eslint-disable-next-line
    fetchEDDDepositLimits: (state, action: PayloadAction<{ currency: FiatType }>) => {},

    fetchEDDDepositLimitsFailure: (state, action: PayloadAction<ErrorStringType>) => {
      state.interestEDDDepositLimits = Remote.Failure(action.payload.error)
    },

    fetchEDDDepositLimitsLoading: (state) => {
      state.interestEDDWithdrawLimits = Remote.Loading
    },

    fetchEDDDepositLimitsSuccess: (
      state,
      action: PayloadAction<{ interestEDDDepositLimits: DepositLimits }>
    ) => {
      state.interestEDDDepositLimits = Remote.Success(action.payload.interestEDDDepositLimits)
    },

    // INSTRUMENTS
    fetchEarnInstruments: () => {},

    fetchEarnInstrumentsFailure: (state, action: PayloadAction<string>) => {
      state.instruments = Remote.Failure(action.payload)
    },

    fetchEarnInstrumentsLoading: (state) => {
      state.instruments = Remote.Loading
    },

    fetchEarnInstrumentsSuccess: (
      state,
      action: PayloadAction<{ earnInstruments: EarnInstrumentsType }>
    ) => {
      state.instruments = Remote.Success(action.payload.earnInstruments)
    },

    // ACCOUNT
    // eslint-disable-next-line
    fetchInterestAccount: (state, action: PayloadAction<{ coin?: CoinType }>) => {},

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

    fetchInterestEligibleSuccess: (state, action: PayloadAction<EarnEligibleType>) => {
      state.interestEligible = Remote.Success(action.payload)
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
    fetchInterestRates: () => {},
    fetchInterestRatesFailure: (state, action: PayloadAction<string>) => {
      state.interestRates = Remote.Failure(action.payload)
    },
    fetchInterestRatesLoading: (state) => {
      state.interestRates = Remote.Loading
    },
    fetchInterestRatesSuccess: (state, action: PayloadAction<RewardsRatesType>) => {
      state.interestRates = Remote.Success(action.payload.rates)
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

    // Staking ELIGIBLE
    fetchStakingEligible: () => {},

    fetchStakingEligibleFailure: (state, action: PayloadAction<string>) => {
      state.stakingEligible = Remote.Failure(action.payload)
    },

    fetchStakingEligibleLoading: (state) => {
      state.stakingEligible = Remote.Loading
    },

    fetchStakingEligibleSuccess: (state, action: PayloadAction<EarnEligibleType>) => {
      state.stakingEligible = Remote.Success(action.payload)
    },

    // Staking RATES
    fetchStakingRates: () => {},
    fetchStakingRatesFailure: (state, action: PayloadAction<string>) => {
      state.stakingRates = Remote.Failure(action.payload)
    },
    fetchStakingRatesLoading: (state) => {
      state.stakingRates = Remote.Loading
    },
    fetchStakingRatesSuccess: (state, action: PayloadAction<StakingRatesType>) => {
      state.stakingRates = Remote.Success(action.payload.rates)
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
      state.rewardsStep = {
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

    setStakingModal: (
      state,
      action: PayloadAction<{ data?: InterestStepMetadata; name: StakingStep }>
    ) => {
      const { data, name } = action.payload
      state.stakingStep = {
        data: data || {},
        name
      }
    },

    setTransactionsNextPage: (state, action: PayloadAction<{ nextPage: string | null }>) => {
      state.transactionsNextPage = action.payload.nextPage
    },

    setUnderSanctions: (state, action: PayloadAction<{ message: string | null }>) => {
      state.underSanctionsMessage = action.payload.message
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

    showStakingModal: (state, action: PayloadAction<{ coin: CoinType; step: StakingStep }>) => {
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
  fetchEarnInstruments,
  fetchEarnInstrumentsFailure,
  fetchEarnInstrumentsLoading,
  fetchEarnInstrumentsSuccess,
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
  fetchInterestLimits,
  fetchInterestLimitsFailure,
  fetchInterestLimitsLoading,
  fetchInterestLimitsSuccess,
  fetchInterestRates,
  fetchInterestRatesFailure,
  fetchInterestRatesLoading,
  fetchInterestRatesSuccess,
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
  fetchStakingEligible,
  fetchStakingEligibleFailure,
  fetchStakingEligibleLoading,
  fetchStakingEligibleSuccess,
  fetchStakingRates,
  fetchStakingRatesFailure,
  fetchStakingRatesLoading,
  fetchStakingRatesSuccess,
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
  setStakingModal,
  setTransactionsNextPage,
  setWithdrawalMinimumsFailure,
  setWithdrawalMinimumsLoading,
  setWithdrawalMinimumsSuccess,
  showInterestModal,
  showStakingModal,
  stopShowingInterestModal,
  submitDepositForm
} = interestSlice.actions

const { actions } = interestSlice
const interestReducer = interestSlice.reducer
export { actions, interestReducer }
