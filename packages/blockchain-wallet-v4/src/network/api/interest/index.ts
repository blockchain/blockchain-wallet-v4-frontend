import { CoinType, FiatType, WalletFiatType } from 'core/types'

import {
  CustodialTransferResponseType,
  DepositLimits,
  InterestAccountBalanceType,
  InterestAccountType,
  InterestAfterTransactionType,
  InterestEDDStatus,
  InterestEligibleType,
  InterestInstrumentsType,
  InterestLimitsType,
  InterestRateType,
  InterestTransactionResponseType,
  InterestWithdrawalResponseType,
  WithdrawalMinimumType,
  WithdrawLimits
} from './types'

export default ({ authorizedGet, authorizedPost, authorizedPut, nabuUrl }) => {
  // TODO - consider removing parameters since we never pass anything here
  const getInterestAccountBalance = (
    ccy?: CoinType,
    din?: FiatType
  ): InterestAccountBalanceType =>
    authorizedGet({
      url: nabuUrl,
      endPoint: '/accounts/savings',
      data: {
        ccy,
        din
      }
    })

  const getInterestEligible = (): InterestEligibleType =>
    authorizedGet({
      url: nabuUrl,
      endPoint: '/savings/eligible'
    })

  const getInterestInstruments = (): InterestInstrumentsType =>
    authorizedGet({
      url: nabuUrl,
      endPoint: '/savings/instruments'
    })

  const getInterestLimits = (
    ccy: CoinType,
    currency: FiatType
  ): { limits: InterestLimitsType } =>
    authorizedGet({
      url: nabuUrl,
      endPoint: `/savings/limits?ccy=${ccy}&currency=${currency}&`
    })

  const getInterestTransactions = (
    currency?: CoinType,
    nextPageUrl?: string
  ): InterestTransactionResponseType =>
    nextPageUrl
      ? authorizedGet({
          url: nabuUrl,
          endPoint: nextPageUrl + '&pending=true&'
        })
      : authorizedGet({
          url: nabuUrl,
          endPoint: '/payments/transactions',
          data: {
            currency,
            product: 'SAVINGS',
            pending: true
          }
        })

  const getInterestSavingsRate = (): InterestRateType =>
    authorizedGet({
      url: nabuUrl,
      endPoint: '/savings/rates'
    })

  const getInterestAccount = (ccy: CoinType): InterestAccountType =>
    authorizedGet({
      url: nabuUrl,
      ignoreQueryParams: true,
      endPoint: `/payments/accounts/savings?ccy=${ccy}`
    })

  const getWithdrawalMinsAndFees = (): WithdrawalMinimumType =>
    authorizedGet({
      url: nabuUrl,
      ignoreQueryParams: true,
      endPoint: '/payments/withdrawals/fees?product=SAVINGS'
    })

  const initiateInterestWithdrawal = (
    amount: string,
    currency: CoinType,
    withdrawalAddress: string
  ): InterestWithdrawalResponseType =>
    authorizedPost({
      contentType: 'application/json',
      data: {
        amount,
        currency,
        withdrawalAddress
      },
      endPoint: '/savings/withdrawals',
      url: nabuUrl
    })

  const transferFromCustodial = (
    amount: string,
    currency: CoinType
  ): CustodialTransferResponseType =>
    authorizedPost({
      contentType: 'application/json',
      endpoint: '/user/balance/transfer',
      data: {
        amount,
        currency,
        origin: 'SIMPLEBUY',
        destination: 'SAVINGS'
      }
    })

  const getInterestCtaAfterTransaction = (
    currency?: WalletFiatType
  ): InterestAfterTransactionType =>
    authorizedGet({
      url: nabuUrl,
      endPoint: '/savings/cta/after-transaction',
      data: {
        currency
      }
    })

  const stopInterestCtaAfterTransaction = (
    enabled: boolean
  ): InterestAfterTransactionType =>
    authorizedPut({
      url: nabuUrl,
      endPoint: '/savings/cta/after-transaction/enabled',
      data: {
        enabled
      }
    })

  const getSavingsEDDStatus = (): InterestEDDStatus =>
    authorizedGet({
      url: nabuUrl,
      endPoint: '/savings/edd/status'
    })

  const getSavingsEDDDepositLimits = (): DepositLimits =>
    authorizedGet({
      url: nabuUrl,
      endPoint: '/savings/edd/limits/deposit'
    })

  const getSavingsEDDWithdrawLimits = (): WithdrawLimits =>
    authorizedGet({
      url: nabuUrl,
      endPoint: '/savings/edd/limits/withdraw'
    })

  return {
    getInterestAccountBalance,
    getInterestCtaAfterTransaction,
    getInterestEligible,
    getInterestInstruments,
    getInterestLimits,
    getInterestAccount,
    getInterestSavingsRate,
    getInterestTransactions,
    getSavingsEDDStatus,
    getSavingsEDDWithdrawLimits,
    getSavingsEDDDepositLimits,
    getWithdrawalMinsAndFees,
    initiateInterestWithdrawal,
    transferFromCustodial,
    stopInterestCtaAfterTransaction
  }
}
