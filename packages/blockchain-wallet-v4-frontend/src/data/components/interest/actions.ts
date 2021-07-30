import {
  InterestAccountBalanceType,
  InterestAccountType,
  InterestAfterTransactionType,
  InterestEDDStatus,
  InterestEligibleType,
  InterestInstrumentsType,
  InterestLimitsType,
  InterestRateType,
  InterestTransactionType,
  WithdrawalMinimumType,
  WithdrawLimits
} from 'blockchain-wallet-v4/src/network/api/interest/types'
import { CoinType, FiatType, PaymentValue, WalletFiatType } from 'blockchain-wallet-v4/src/types'

import * as AT from './actionTypes'
import {
  InterestActionTypes,
  InterestMinMaxType,
  InterestStep,
  InterestStepMetadata,
  InterestTransactionsReportType
} from './types'

// BALANCES
export const fetchInterestBalance = (coin?: CoinType) => ({
  payload: { coin },
  type: AT.FETCH_INTEREST_BALANCE
})
export const fetchInterestBalanceFailure = (error: string): InterestActionTypes => ({
  payload: { error },
  type: AT.FETCH_INTEREST_BALANCE_FAILURE
})
export const fetchInterestBalanceLoading = (): InterestActionTypes => ({
  type: AT.FETCH_INTEREST_BALANCE_LOADING
})
export const fetchInterestBalanceSuccess = (
  interestAccountBalance: InterestAccountBalanceType
): InterestActionTypes => ({
  payload: { interestAccountBalance },
  type: AT.FETCH_INTEREST_BALANCE_SUCCESS
})

// ELIGIBLE
export const fetchInterestEligible = () => ({
  type: AT.FETCH_INTEREST_ELIGIBLE
})
export const fetchInterestEligibleFailure = (error: string): InterestActionTypes => ({
  payload: { error },
  type: AT.FETCH_INTEREST_ELIGIBLE_FAILURE
})
export const fetchInterestEligibleLoading = (): InterestActionTypes => ({
  type: AT.FETCH_INTEREST_ELIGIBLE_LOADING
})
export const fetchInterestEligibleSuccess = (
  interestEligible: InterestEligibleType
): InterestActionTypes => ({
  payload: { interestEligible },
  type: AT.FETCH_INTEREST_ELIGIBLE_SUCCESS
})

// INSTRUMENTS
export const fetchInterestInstruments = () => ({
  type: AT.FETCH_INTEREST_INSTRUMENTS
})
export const fetchInterestInstrumentsFailure = (error: string): InterestActionTypes => ({
  payload: { error },
  type: AT.FETCH_INTEREST_INSTRUMENTS_FAILURE
})
export const fetchInterestInstrumentsLoading = (): InterestActionTypes => ({
  type: AT.FETCH_INTEREST_INSTRUMENTS_LOADING
})
export const fetchInterestInstrumentsSuccess = (
  interestInstruments: InterestInstrumentsType
): InterestActionTypes => ({
  payload: { interestInstruments },
  type: AT.FETCH_INTEREST_INSTRUMENTS_SUCCESS
})

// LIMITS
export const fetchInterestLimits = (coin: CoinType, currency: FiatType) => ({
  coin,
  currency,
  type: AT.FETCH_INTEREST_LIMITS
})
export const fetchInterestLimitsFailure = (error: string): InterestActionTypes => ({
  payload: { error },
  type: AT.FETCH_INTEREST_LIMITS_FAILURE
})
export const fetchInterestLimitsLoading = (): InterestActionTypes => ({
  type: AT.FETCH_INTEREST_LIMITS_LOADING
})
export const fetchInterestLimitsSuccess = (
  interestLimits: InterestLimitsType
): InterestActionTypes => ({
  payload: { interestLimits },
  type: AT.FETCH_INTEREST_LIMITS_SUCCESS
})

export const setWithdrawalMinimumsFailure = (error: string) => ({
  payload: {
    error
  },
  type: AT.SET_WITHDRAWAL_MINIMUMS_FAILURE
})

export const setWithdrawalMinimumsLoading = () => ({
  type: AT.SET_WITHDRAWAL_MINIMUMS_LOADING
})
export const setWithdrawalMinimumsSuccess = (withdrawalMinimums: WithdrawalMinimumType) => ({
  payload: { withdrawalMinimums },
  type: AT.SET_WITHDRAWAL_MINIMUMS_SUCCESS
})

// ACCOUNT
export const fetchInterestAccount = (coin?: CoinType) => ({
  coin,
  type: AT.FETCH_INTEREST_PAYMENT_ACCOUNT
})
export const fetchInterestAccountFailure = (error: string): InterestActionTypes => ({
  payload: { error },
  type: AT.FETCH_INTEREST_PAYMENT_ACCOUNT_FAILURE
})
export const fetchInterestAccountLoading = (): InterestActionTypes => ({
  type: AT.FETCH_INTEREST_PAYMENT_ACCOUNT_LOADING
})
export const fetchInterestAccountSuccess = (account: InterestAccountType): InterestActionTypes => ({
  payload: { account },
  type: AT.FETCH_INTEREST_PAYMENT_ACCOUNT_SUCCESS
})

// INTEREST RATES
export const fetchInterestRate = () => ({
  type: AT.FETCH_INTEREST_RATE
})
export const fetchInterestRateFailure = (error: string): InterestActionTypes => ({
  payload: { error },
  type: AT.FETCH_INTEREST_RATE_FAILURE
})
export const fetchInterestRateLoading = (): InterestActionTypes => ({
  type: AT.FETCH_INTEREST_RATE_LOADING
})
export const fetchInterestRateSuccess = (interestRate: InterestRateType): InterestActionTypes => ({
  payload: { interestRate },
  type: AT.FETCH_INTEREST_RATE_SUCCESS
})

// TRANSACTIONS
export const clearInterestTransactionsReport = () => ({
  type: AT.CLEAR_INTEREST_TRANSACTIONS_REPORT
})
export const fetchInterestTransactionsReport = (coin?: CoinType) => ({
  payload: { coin },
  type: AT.FETCH_INTEREST_TRANSACTIONS_REPORT
})
export const fetchInterestTransactionsReportFailure = (error: string) => ({
  payload: { error },
  type: AT.FETCH_INTEREST_TRANSACTIONS_REPORT_FAILURE
})
export const fetchInterestTransactionsReportLoading = () => ({
  type: AT.FETCH_INTEREST_TRANSACTIONS_REPORT_LOADING
})
export const fetchInterestTransactionsReportSuccess = (
  transactions: InterestTransactionsReportType
) => ({
  payload: { transactions },
  type: AT.FETCH_INTEREST_TRANSACTIONS_REPORT_SUCCESS
})
export const fetchInterestTransactions = (reset: boolean, coin?: CoinType) => ({
  payload: { coin, reset },
  type: AT.FETCH_INTEREST_TRANSACTIONS
})
export const fetchInterestTransactionsFailure = (error: string): InterestActionTypes => ({
  payload: { error },
  type: AT.FETCH_INTEREST_TRANSACTIONS_FAILURE
})
export const fetchInterestTransactionsLoading = (reset: boolean): InterestActionTypes => ({
  payload: { reset },
  type: AT.FETCH_INTEREST_TRANSACTIONS_LOADING
})
export const fetchInterestTransactionsSuccess = (
  transactions: Array<InterestTransactionType>,
  reset: boolean
): InterestActionTypes => ({
  payload: { reset, transactions },
  type: AT.FETCH_INTEREST_TRANSACTIONS_SUCCESS
})
export const setTransactionsNextPage = (nextPage: string | null): InterestActionTypes => ({
  payload: { nextPage },
  type: AT.SET_TRANSACTIONS_NEXT_PAGE
})

// DEPOSIT
export const initializeDepositModal = (): InterestActionTypes => ({
  type: AT.INITIALIZE_DEPOSIT_MODAL
})
export const initializeDepositForm = (coin: CoinType, currency: FiatType) => ({
  payload: { coin, currency },
  type: AT.INITIALIZE_DEPOSIT_FORM
})
export const setDepositLimits = (limits: InterestMinMaxType) => ({
  payload: { limits },
  type: AT.SET_INTEREST_DEPOSIT_LIMITS
})
export const submitDepositForm = (coin: CoinType) => ({
  payload: { coin },
  type: AT.SUBMIT_DEPOSIT_FORM
})

// WITHDRAWAL
export const initializeWithdrawalForm = (coin: CoinType, walletCurrency: FiatType) => ({
  payload: { coin, walletCurrency },
  type: AT.INITIALIZE_WITHDRAWAL_FORM
})
export const requestWithdrawal = (coin: CoinType, withdrawalAmount: number) => ({
  payload: { coin, withdrawalAmount },
  type: AT.REQUEST_WITHDRAWAL
})

// PAYMENTS
export const setPaymentFailure = (error: string): InterestActionTypes => ({
  payload: {
    error
  },
  type: AT.SET_PAYMENT_FAILURE
})
export const setPaymentLoading = (): InterestActionTypes => ({
  type: AT.SET_PAYMENT_LOADING
})
export const setPaymentSuccess = (payment?: PaymentValue): InterestActionTypes => ({
  payload: {
    payment
  },
  type: AT.SET_PAYMENT_SUCCESS
})

// MISC
export const routeToTxHash = (coin: CoinType, txHash?: string) => ({
  payload: { coin, txHash },
  type: AT.ROUTE_TO_TX_HASH
})
export const setInterestStep = (name: InterestStep, data?: InterestStepMetadata) => ({
  payload: { data, name },
  type: AT.SET_INTEREST_STEP
})
export const setCoinDisplay = (isAmountDisplayedInCrypto: boolean) => ({
  payload: { isAmountDisplayedInCrypto },
  type: AT.SET_COIN_DISPLAY
})
export const showInterestModal = (step: InterestStep, coin: CoinType) => ({
  payload: { coin, step },
  type: AT.SHOW_INTEREST_MODAL
})
export const stopShowingInterestModal = () => ({
  type: AT.STOP_SHOWING_INTEREST_MODAL
})
export const handleTransferMaxAmountClick = ({
  amount,
  coin
}: {
  amount: number
  coin: 'FIAT' | CoinType
}) => ({
  payload: { amount, coin },
  type: AT.HANDLE_TRANSFER_MAX_AMOUNT_CLICK
})
export const handleTransferMinAmountClick = ({
  amount,
  coin
}: {
  amount: number
  coin: 'FIAT' | CoinType
}) => ({
  payload: { amount, coin },
  type: AT.HANDLE_TRANSFER_MIN_AMOUNT_CLICK
})
export const handleWithdrawalSupplyInformation = ({ origin }: { origin: string }) => ({
  payload: { origin },
  type: AT.HANDLE_WITHDRAWAL_SUPPLY_INFORMATION
})

// INTEREST CTA/Card AFTER TRANSACTION
export const fetchShowInterestCardAfterTransaction = (currency?: WalletFiatType) => ({
  payload: { currency },
  type: AT.FETCH_SHOW_INTEREST_CARD_AFTER_TRANSACTION
})
export const fetchShowInterestCardAfterTransactionFailure = (
  error: string
): InterestActionTypes => ({
  payload: { error },
  type: AT.FETCH_SHOW_INTEREST_CARD_AFTER_TRANSACTION_FAILURE
})
export const fetchShowInterestCardAfterTransactionLoading = (): InterestActionTypes => ({
  type: AT.FETCH_SHOW_INTEREST_CARD_AFTER_TRANSACTION_LOADING
})
export const fetchShowInterestCardAfterTransactionSuccess = (
  afterTransaction: InterestAfterTransactionType
): InterestActionTypes => ({
  payload: { afterTransaction },
  type: AT.FETCH_SHOW_INTEREST_CARD_AFTER_TRANSACTION_SUCCESS
})
export const resetShowInterestCardAfterTransaction = (): InterestActionTypes => ({
  type: AT.RESET_SHOW_INTEREST_CARD_AFTER_TRANSACTION
})

// EDD
export const fetchEDDStatus = () => ({
  type: AT.FETCH_EDD_STATUS
})
export const fetchEDDStatusFailure = (error: string): InterestActionTypes => ({
  payload: { error },
  type: AT.FETCH_EDD_STATUS_FAILURE
})
export const fetchEDDStatusLoading = (): InterestActionTypes => ({
  type: AT.FETCH_EDD_STATUS_LOADING
})
export const fetchEDDStatusSuccess = (eddStatus: InterestEDDStatus): InterestActionTypes => ({
  payload: { eddStatus },
  type: AT.FETCH_EDD_STATUS_SUCCESS
})
export const fetchEddWithdrawLimits = (currency: FiatType) => ({
  payload: { currency },
  type: AT.FETCH_EDD_WITHDRAW_LIMITS
})
export const fetchEddWithdrawLimitsFailure = (error: string): InterestActionTypes => ({
  payload: { error },
  type: AT.FETCH_EDD_WITHDRAW_LIMITS_FAILURE
})
export const fetchEddWithdrawLimitsLoading = (): InterestActionTypes => ({
  type: AT.FETCH_EDD_WITHDRAW_LIMITS_LOADING
})
export const fetchEddWithdrawLimitsSuccess = (
  interestEDDWithdrawLimits: WithdrawLimits
): InterestActionTypes => ({
  payload: { interestEDDWithdrawLimits },
  type: AT.FETCH_EDD_WITHDRAW_LIMITS_SUCCESS
})
