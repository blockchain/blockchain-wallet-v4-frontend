import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { append, assoc, compose, dropLast, lensProp, over } from 'ramda'

import {
  EarnAccountBalanceResponseType,
  EarnAccountResponseType,
  EarnAfterTransactionType,
  EarnDepositLimits,
  EarnEDDStatus,
  EarnEligibleType,
  EarnLimitsType,
  EarnRatesType,
  InterestLimitsType,
  RewardsRatesType,
  WithdrawalMinimumTypeResponse,
  WithdrawLimits
} from '@core/network/api/earn/types'
import Remote from '@core/remote'
import { CoinType, FiatType, PaymentValue, WalletFiatType } from '@core/types'

import {
  ActiveRewardsStep,
  ActiveRewardsWithdrawalType,
  EarnDepositFormType,
  EarnInitializeWithdrawalType,
  EarnInstrumentsType,
  EarnMinMaxType,
  EarnStepMetaData,
  EarnTabsType,
  EarnTransactionType,
  EarnWithdrawalType,
  ErrorStringType,
  InterestLimits,
  InterestState,
  InterestStep,
  PendingTransactionType,
  PendingWithdrawalsType,
  StakingStep,
  StakingWithdrawalType,
  TransferMinMaxAmountType
} from './types'

const initialState: InterestState = {
  activeRewardsAccount: Remote.NotAsked,
  activeRewardsAccountBalance: Remote.NotAsked,
  activeRewardsEligible: Remote.NotAsked,
  activeRewardsLimits: Remote.NotAsked,
  activeRewardsRates: Remote.NotAsked,
  activeRewardsStep: {
    data: {},
    name: 'WARNING'
  },
  activeRewardsTransactionsNextPage: null,
  afterTransaction: Remote.NotAsked,
  coin: 'BTC',
  earnDepositLimits: {
    maxCoin: 0,
    maxFiat: 0,
    minCoin: 0,
    minFiat: 0
  },
  earnEDDStatus: Remote.NotAsked,
  earnEDDWithdrawLimits: Remote.NotAsked,
  earnTab: 'All',
  instruments: Remote.NotAsked,
  interestEligible: Remote.NotAsked,
  interestLimits: Remote.NotAsked,
  interestRates: Remote.NotAsked,
  isAmountDisplayedInCrypto: false,
  passiveRewardsAccountBalance: Remote.NotAsked,
  payment: Remote.NotAsked,
  pendingActiveRewardsTransactions: Remote.NotAsked,
  pendingStakingTransactions: Remote.NotAsked,
  rewardsAccount: Remote.NotAsked,
  rewardsEDDDepositLimits: Remote.NotAsked,
  rewardsStep: {
    data: {},
    name: 'ACCOUNT_SUMMARY'
  },
  rewardsTransactionsNextPage: null,
  searchValue: '',
  showAvailableAssets: false,
  stakingAccount: Remote.NotAsked,
  stakingAccountBalance: Remote.NotAsked,
  stakingEligible: Remote.NotAsked,
  stakingLimits: Remote.NotAsked,
  stakingRates: Remote.NotAsked,
  stakingStep: {
    data: {},
    name: 'WARNING'
  },
  stakingTransactionsNextPage: null,
  stakingWithdrawals: Remote.NotAsked,
  totalActiveRewardsBondingDeposits: 0,
  totalStakingBondingDeposits: 0,
  transactions: [],
  transactionsReport: Remote.NotAsked,
  underSanctionsMessage: null,
  withdrawalMinimums: Remote.NotAsked
}

const interestSlice = createSlice({
  initialState,
  name: 'brokerage',
  reducers: {
    clearInterestTransactionsReport: () => {},
    // ACCOUNT
    fetchActiveRewardsAccount: (state, action: PayloadAction<{ coin: CoinType }>) => {},

    fetchActiveRewardsAccountFailure: (state, action: PayloadAction<string>) => {
      state.activeRewardsAccount = Remote.Failure(action.payload)
    },

    fetchActiveRewardsAccountLoading: (state) => {
      state.activeRewardsAccount = Remote.Loading
    },

    fetchActiveRewardsAccountSuccess: (state, action: PayloadAction<EarnAccountResponseType>) => {
      state.activeRewardsAccount = Remote.Success(action.payload)
    },
    // BALANCES
    fetchActiveRewardsBalance: () => {},

    fetchActiveRewardsBalanceFailure: (state, action: PayloadAction<string>) => {
      state.activeRewardsAccountBalance = Remote.Failure(action.payload)
    },

    fetchActiveRewardsBalanceLoading: (state) => {
      state.activeRewardsAccountBalance = Remote.Loading
    },

    fetchActiveRewardsBalanceSuccess: (
      state,
      action: PayloadAction<EarnAccountBalanceResponseType>
    ) => {
      state.activeRewardsAccountBalance = Remote.Success(action.payload)
    },
    // ActiveRewards ELIGIBLE
    fetchActiveRewardsEligible: () => {},
    fetchActiveRewardsEligibleFailure: (state, action: PayloadAction<string>) => {
      state.activeRewardsEligible = Remote.Failure(action.payload)
    },
    fetchActiveRewardsEligibleLoading: (state) => {
      state.activeRewardsEligible = Remote.Loading
    },
    fetchActiveRewardsEligibleSuccess: (state, action: PayloadAction<EarnEligibleType>) => {
      state.activeRewardsEligible = Remote.Success(action.payload)
    },
    // Active Rewards LIMITS
    fetchActiveRewardsLimits: () => {},
    fetchActiveRewardsLimitsFailure: (state, action: PayloadAction<string>) => {
      state.activeRewardsLimits = Remote.Failure(action.payload)
    },
    fetchActiveRewardsLimitsLoading: (state) => {
      state.activeRewardsLimits = Remote.Loading
    },
    fetchActiveRewardsLimitsSuccess: (state, action: PayloadAction<EarnLimitsType>) => {
      state.activeRewardsLimits = Remote.Success(action.payload)
    },

    // Active Rewards RATES
    fetchActiveRewardsRates: () => {},
    fetchActiveRewardsRatesFailure: (state, action: PayloadAction<string>) => {
      state.activeRewardsRates = Remote.Failure(action.payload)
    },
    fetchActiveRewardsRatesLoading: (state) => {
      state.activeRewardsRates = Remote.Loading
    },
    fetchActiveRewardsRatesSuccess: (state, action: PayloadAction<EarnRatesType>) => {
      state.activeRewardsRates = Remote.Success(action.payload.rates)
    },

    fetchEDDStatus: () => {},

    fetchEDDStatusFailure: (state, action: PayloadAction<ErrorStringType>) => {
      state.earnEDDStatus = Remote.Failure(action.payload.error)
    },

    fetchEDDStatusLoading: (state) => {
      state.earnEDDStatus = Remote.Loading
    },

    fetchEDDStatusSuccess: (state, action: PayloadAction<{ eddStatus: EarnEDDStatus }>) => {
      state.earnEDDStatus = Remote.Success(action.payload.eddStatus)
    },

    // eslint-disable-next-line
    fetchEDDWithdrawLimits: (state, action: PayloadAction<{ currency: FiatType }>) => {},

    fetchEDDWithdrawLimitsFailure: (state, action: PayloadAction<ErrorStringType>) => {
      state.earnEDDWithdrawLimits = Remote.Failure(action.payload.error)
    },

    fetchEDDWithdrawLimitsLoading: (state) => {
      state.earnEDDWithdrawLimits = Remote.Loading
    },

    fetchEDDWithdrawLimitsSuccess: (
      state,
      action: PayloadAction<{ earnEDDWithdrawLimits: WithdrawLimits }>
    ) => {
      state.earnEDDWithdrawLimits = Remote.Success(action.payload.earnEDDWithdrawLimits)
    },
    // eslint-disable-next-line
    fetchEDDDepositLimits: (state, action: PayloadAction<{ currency: FiatType }>) => {},

    fetchEDDDepositLimitsFailure: (state, action: PayloadAction<ErrorStringType>) => {
      state.rewardsEDDDepositLimits = Remote.Failure(action.payload.error)
    },

    fetchEDDDepositLimitsLoading: (state) => {
      state.earnEDDWithdrawLimits = Remote.Loading
    },

    fetchEDDDepositLimitsSuccess: (
      state,
      action: PayloadAction<{ rewardsEDDDepositLimits: EarnDepositLimits }>
    ) => {
      state.rewardsEDDDepositLimits = Remote.Success(action.payload.rewardsEDDDepositLimits)
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

    fetchEarnTransactions: (
      // eslint-disable-next-line
      state,
      // eslint-disable-next-line
      action: PayloadAction<{ coin?: CoinType; reset: boolean }>
    ) => {},
    fetchEarnTransactionsFailure: (state, action: PayloadAction<string>) => {
      const newState = assoc('transactions', [Remote.Failure(action.payload)], state)
      state.transactions = newState.transactions
    },
    fetchEarnTransactionsLoading: (state, action: PayloadAction<{ reset: boolean }>) => {
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
    fetchEarnTransactionsReport: () => {},

    fetchEarnTransactionsReportFailure: (state, action: PayloadAction<string>) => {
      state.transactionsReport = Remote.Failure(action.payload)
    },
    fetchEarnTransactionsReportLoading: (state) => {
      state.transactionsReport = Remote.Loading
    },
    fetchEarnTransactionsReportSuccess: (state, action: PayloadAction<EarnTransactionType[]>) => {
      state.transactionsReport = Remote.Success(action.payload)
    },

    fetchEarnTransactionsSuccess: (
      state,
      action: PayloadAction<{ reset: boolean; transactions: Array<EarnTransactionType> }>
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

    fetchPendingActiveRewardsTransactions: (state, action: PayloadAction<{ coin: CoinType }>) => {},
    fetchPendingActiveRewardsTransactionsFailure: (state, action: PayloadAction<string>) => {
      state.pendingActiveRewardsTransactions = Remote.Failure(action.payload)
    },
    fetchPendingActiveRewardsTransactionsLoading: (state) => {
      state.pendingActiveRewardsTransactions = Remote.Loading
    },
    fetchPendingActiveRewardsTransactionsSuccess: (
      state,
      action: PayloadAction<Array<PendingTransactionType>>
    ) => {
      state.pendingActiveRewardsTransactions = Remote.Success(action.payload)
    },

    fetchPendingStakingTransactions: (state, action: PayloadAction<{ coin: CoinType }>) => {},
    fetchPendingStakingTransactionsFailure: (state, action: PayloadAction<string>) => {
      state.pendingStakingTransactions = Remote.Failure(action.payload)
    },
    fetchPendingStakingTransactionsLoading: (state) => {
      state.pendingStakingTransactions = Remote.Loading
    },
    fetchPendingStakingTransactionsSuccess: (
      state,
      action: PayloadAction<Array<PendingTransactionType>>
    ) => {
      state.pendingStakingTransactions = Remote.Success(action.payload)
    },

    // ACCOUNT
    // eslint-disable-next-line
    fetchRewardsAccount: (state, action: PayloadAction<{ coin?: CoinType }>) => {},

    fetchRewardsAccountFailure: (state, action: PayloadAction<string>) => {
      state.rewardsAccount = Remote.Failure(action.payload)
    },

    fetchRewardsAccountLoading: (state) => {
      state.rewardsAccount = Remote.Loading
    },

    fetchRewardsAccountSuccess: (state, action: PayloadAction<EarnAccountResponseType>) => {
      state.rewardsAccount = Remote.Success(action.payload)
    },

    // BALANCES
    fetchRewardsBalance: () => {},

    fetchRewardsBalanceFailure: (state, action: PayloadAction<string>) => {
      state.passiveRewardsAccountBalance = Remote.Failure(action.payload)
    },

    fetchRewardsBalanceLoading: (state) => {
      state.passiveRewardsAccountBalance = Remote.Loading
    },

    fetchRewardsBalanceSuccess: (state, action: PayloadAction<EarnAccountBalanceResponseType>) => {
      state.passiveRewardsAccountBalance = Remote.Success(action.payload)
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
      action: PayloadAction<{ afterTransaction: EarnAfterTransactionType }>
    ) => {
      state.afterTransaction = Remote.Success(action.payload.afterTransaction)
    },

    // ACCOUNT
    // eslint-disable-next-line
    fetchStakingAccount: (state, action: PayloadAction<{ coin: CoinType }>) => {},

    fetchStakingAccountFailure: (state, action: PayloadAction<string>) => {
      state.stakingAccount = Remote.Failure(action.payload)
    },

    fetchStakingAccountLoading: (state) => {
      state.stakingAccount = Remote.Loading
    },

    fetchStakingAccountSuccess: (state, action: PayloadAction<EarnAccountResponseType>) => {
      state.stakingAccount = Remote.Success(action.payload)
    },

    // BALANCES
    fetchStakingBalance: () => {},

    fetchStakingBalanceFailure: (state, action: PayloadAction<string>) => {
      state.stakingAccountBalance = Remote.Failure(action.payload)
    },

    fetchStakingBalanceLoading: (state) => {
      state.stakingAccountBalance = Remote.Loading
    },

    fetchStakingBalanceSuccess: (state, action: PayloadAction<EarnAccountBalanceResponseType>) => {
      state.stakingAccountBalance = Remote.Success(action.payload)
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

    // STAKING LIMITS
    fetchStakingLimits: () => {},
    fetchStakingLimitsFailure: (state, action: PayloadAction<string>) => {
      state.stakingLimits = Remote.Failure(action.payload)
    },
    fetchStakingLimitsLoading: (state) => {
      state.stakingLimits = Remote.Loading
    },
    fetchStakingLimitsSuccess: (state, action: PayloadAction<EarnLimitsType>) => {
      state.stakingLimits = Remote.Success(action.payload)
    },

    // Staking RATES
    fetchStakingRates: () => {},
    fetchStakingRatesFailure: (state, action: PayloadAction<string>) => {
      state.stakingRates = Remote.Failure(action.payload)
    },
    fetchStakingRatesLoading: (state) => {
      state.stakingRates = Remote.Loading
    },
    fetchStakingRatesSuccess: (state, action: PayloadAction<EarnRatesType>) => {
      state.stakingRates = Remote.Success(action.payload.rates)
    },

    // STAKING WITHDRAWALS
    fetchStakingWithdrawals: () => {},
    fetchStakingWithdrawalsFailure: (state, action: PayloadAction<string>) => {
      state.stakingWithdrawals = Remote.Failure(action.payload)
    },
    fetchStakingWithdrawalsLoading: (state) => {
      state.stakingWithdrawals = Remote.Loading
    },
    fetchStakingWithdrawalsSuccess: (state, action: PayloadAction<PendingWithdrawalsType>) => {
      state.stakingWithdrawals = Remote.Success(action.payload)
    },

    handleTransferMaxAmountClick: (
      // eslint-disable-next-line
      state,
      // eslint-disable-next-line
      action: PayloadAction<TransferMinMaxAmountType>
    ) => {},
    handleTransferMinAmountClick: (
      // eslint-disable-next-line
      state,
      // eslint-disable-next-line
      action: PayloadAction<TransferMinMaxAmountType>
    ) => {},
    // eslint-disable-next-line
    handleWithdrawalSupplyInformation: (state, action: PayloadAction<{ origin: string }>) => {},

    initializeActiveRewardsDepositForm: (
      state,
      action: PayloadAction<{ coin: CoinType; currency: FiatType }>
    ) => {
      state.coin = action.payload.coin
    },

    initializeInterestDepositForm: (
      state,
      action: PayloadAction<{ coin: CoinType; currency: FiatType }>
    ) => {
      state.coin = action.payload.coin
    },

    initializeStakingDepositForm: (
      state,
      action: PayloadAction<{ coin: CoinType; currency: FiatType }>
    ) => {
      state.coin = action.payload.coin
    },

    initializeWithdrawalForm: (
      // eslint-disable-next-line
      state,
      // eslint-disable-next-line
      action: PayloadAction<EarnInitializeWithdrawalType>
    ) => {},

    requestActiveRewardsWithdrawal: (
      // eslint-disable-next-line
      state,
      // eslint-disable-next-line
      action: PayloadAction<ActiveRewardsWithdrawalType>
    ) => {},

    requestStakingWithdrawal: (
      // eslint-disable-next-line
      state,
      // eslint-disable-next-line
      action: PayloadAction<StakingWithdrawalType>
    ) => {},

    // eslint-disable-next-line
    requestWithdrawal: (state, action: PayloadAction<EarnWithdrawalType>) => {},

    resetShowInterestCardAfterTransaction: (state) => {
      state.afterTransaction = Remote.NotAsked
    },
    // eslint-disable-next-line
    routeToTxHash: (state, action: PayloadAction<{ coin: CoinType; txHash?: string }>) => {},

    setActiveRewardsStep: (
      state,
      action: PayloadAction<{ data?: EarnStepMetaData; name: ActiveRewardsStep }>
    ) => {
      const { data, name } = action.payload
      state.activeRewardsStep = {
        data: data || {},
        name
      }
    },
    setActiveRewardsTransactionsNextPage: (
      state,
      action: PayloadAction<{ nextPage?: string | null }>
    ) => {
      state.activeRewardsTransactionsNextPage = action.payload.nextPage
    },

    setCoinDisplay: (state, action: PayloadAction<{ isAmountDisplayedInCrypto: boolean }>) => {
      state.isAmountDisplayedInCrypto = action.payload.isAmountDisplayedInCrypto
    },

    setEarnDepositLimits: (state, action: PayloadAction<{ limits: EarnMinMaxType }>) => {
      state.earnDepositLimits = action.payload.limits
    },

    setEarnTab: (state, action: PayloadAction<{ tab: EarnTabsType }>) => {
      state.earnTab = action.payload.tab
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

    setRewardsStep: (
      state,
      action: PayloadAction<{ data?: EarnStepMetaData; name: InterestStep }>
    ) => {
      const { data, name } = action.payload
      state.rewardsStep = {
        data: data || {},
        name
      }
    },

    setRewardsTransactionsNextPage: (
      state,
      action: PayloadAction<{ nextPage?: string | null }>
    ) => {
      state.rewardsTransactionsNextPage = action.payload.nextPage
    },

    setSearchValue: (state, action: PayloadAction<{ value: string }>) => {
      state.searchValue = action.payload.value
    },

    setShowAvailableAssets: (state, action: PayloadAction<{ status: boolean }>) => {
      state.showAvailableAssets = action.payload.status
    },

    setStakingModal: (
      state,
      action: PayloadAction<{ data?: EarnStepMetaData; name: StakingStep }>
    ) => {
      const { data, name } = action.payload
      state.stakingStep = {
        data: data || {},
        name
      }
    },

    setStakingStep: (
      state,
      action: PayloadAction<{ data?: EarnStepMetaData; name: StakingStep }>
    ) => {
      const { data, name } = action.payload
      state.stakingStep = {
        data: data || {},
        name
      }
    },
    setStakingTransactionsNextPage: (
      state,
      action: PayloadAction<{ nextPage?: string | null }>
    ) => {
      state.stakingTransactionsNextPage = action.payload.nextPage
    },
    setTotalActiveRewardsBondingDeposits: (state, action: PayloadAction<number>) => {
      state.totalActiveRewardsBondingDeposits = action.payload
    },
    setTotalStakingBondingDeposits: (state, action: PayloadAction<number>) => {
      state.totalStakingBondingDeposits = action.payload
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

    showActiveRewardsModal: (
      state,
      action: PayloadAction<{ coin: CoinType; step: ActiveRewardsStep }>
    ) => {
      state.coin = action.payload.coin
    },

    showInterestModal: (state, action: PayloadAction<{ coin: CoinType; step: InterestStep }>) => {
      state.coin = action.payload.coin
    },

    showStakingModal: (state, action: PayloadAction<{ coin: CoinType; step: StakingStep }>) => {
      state.coin = action.payload.coin
    },

    stopShowingInterestModal: () => {},
    // eslint-disable-next-line
    submitDepositForm: (state, action: PayloadAction<{ formName: EarnDepositFormType }>) => {}
  }
})

export const {
  clearInterestTransactionsReport,
  fetchActiveRewardsAccount,
  fetchActiveRewardsAccountFailure,
  fetchActiveRewardsAccountLoading,
  fetchActiveRewardsAccountSuccess,
  fetchActiveRewardsBalance,
  fetchActiveRewardsBalanceFailure,
  fetchActiveRewardsBalanceLoading,
  fetchActiveRewardsBalanceSuccess,
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
  fetchEarnTransactions,
  fetchEarnTransactionsFailure,
  fetchEarnTransactionsLoading,
  fetchEarnTransactionsReport,
  fetchEarnTransactionsReportFailure,
  fetchEarnTransactionsReportLoading,
  fetchEarnTransactionsReportSuccess,
  fetchEarnTransactionsSuccess,
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
  fetchPendingActiveRewardsTransactions,
  fetchPendingActiveRewardsTransactionsFailure,
  fetchPendingActiveRewardsTransactionsLoading,
  fetchPendingActiveRewardsTransactionsSuccess,
  fetchPendingStakingTransactions,
  fetchPendingStakingTransactionsFailure,
  fetchPendingStakingTransactionsLoading,
  fetchPendingStakingTransactionsSuccess,
  fetchRewardsAccount,
  fetchRewardsAccountFailure,
  fetchRewardsAccountLoading,
  fetchRewardsAccountSuccess,
  fetchRewardsBalance,
  fetchRewardsBalanceFailure,
  fetchRewardsBalanceLoading,
  fetchRewardsBalanceSuccess,
  fetchShowInterestCardAfterTransaction,
  fetchShowInterestCardAfterTransactionFailure,
  fetchShowInterestCardAfterTransactionLoading,
  fetchShowInterestCardAfterTransactionSuccess,
  fetchStakingAccount,
  fetchStakingAccountFailure,
  fetchStakingAccountLoading,
  fetchStakingAccountSuccess,
  fetchStakingBalance,
  fetchStakingBalanceFailure,
  fetchStakingBalanceLoading,
  fetchStakingBalanceSuccess,
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
  initializeActiveRewardsDepositForm,
  initializeInterestDepositForm,
  initializeStakingDepositForm,
  initializeWithdrawalForm,
  requestActiveRewardsWithdrawal,
  requestWithdrawal,
  resetShowInterestCardAfterTransaction,
  routeToTxHash,
  setActiveRewardsTransactionsNextPage,
  setCoinDisplay,
  setEarnDepositLimits,
  setEarnTab,
  setPaymentFailure,
  setPaymentLoading,
  setPaymentSuccess,
  setRewardsStep,
  setRewardsTransactionsNextPage,
  setSearchValue,
  setShowAvailableAssets,
  setStakingModal,
  setStakingTransactionsNextPage,
  setTotalActiveRewardsBondingDeposits,
  setTotalStakingBondingDeposits,
  setWithdrawalMinimumsFailure,
  setWithdrawalMinimumsLoading,
  setWithdrawalMinimumsSuccess,
  showActiveRewardsModal,
  showInterestModal,
  showStakingModal,
  stopShowingInterestModal,
  submitDepositForm
} = interestSlice.actions

const { actions } = interestSlice
const interestReducer = interestSlice.reducer
export { actions, interestReducer }
