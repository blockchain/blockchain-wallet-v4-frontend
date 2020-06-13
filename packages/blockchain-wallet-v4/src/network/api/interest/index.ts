import { CoinType, FiatType } from 'core/types'
import {
  InterestAccountBalanceType,
  InterestAccountType,
  InterestEligibleType,
  InterestInstrumentsType,
  InterestLimitsType,
  InterestRateType,
  InterestTransactionResponseType,
  InterestWithdrawalResponseType
} from './types'

export default ({ nabuUrl, authorizedGet, authorizedPost }) => {
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

  const getInterestInstruments = (): InterestInstrumentsType => ({
    instruments: ['BTC', 'ETH']
  })

  // authorizedGet({
  //   url: nabuUrl,
  //   endPoint: '/savings/instruments'
  // })

  const getInterestLimits = (
    ccy: CoinType,
    currency: FiatType
  ): { limits: InterestLimitsType } =>
    authorizedGet({
      url: nabuUrl,
      endPoint: `/savings/limits?ccy=${ccy}&currency=${currency}&`
    })

  const getInterestTransactions = (
    nextPageUrl?: string
  ): InterestTransactionResponseType =>
    authorizedGet({
      url: nabuUrl,
      endPoint: nextPageUrl
        ? nextPageUrl + '&'
        : '/payments/transactions?product=savings&'
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

  const initiateInterestWithdrawal = (
    amount: number,
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

  return {
    getInterestAccountBalance,
    getInterestEligible,
    getInterestInstruments,
    getInterestLimits,
    getInterestAccount,
    getInterestSavingsRate,
    getInterestTransactions,
    initiateInterestWithdrawal
  }
}
