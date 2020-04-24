import { CoinType, FiatType } from 'core/types'
import {
  InterestAccountBalanceType,
  InterestEligibleType,
  InterestInstrumentsType,
  InterestLimitsType,
  InterestPaymentAccountType,
  InterestRateType,
  InterestTransactionType
} from './types'

export default ({ nabuUrl, authorizedGet }) => {
  const getInterestAccountBalance = (): InterestAccountBalanceType => {
    debugger
    let x = authorizedGet({
      url: nabuUrl,
      endpoint: '/accounts/savings'
    })
    debugger
    return x
  }

  const getInterestEligible = (): { interestEligible: InterestEligibleType } =>
    authorizedGet({
      url: nabuUrl,
      endPoint: '/savings/eligible'
    })

  const getInterestInstruments = (): InterestInstrumentsType =>
    authorizedGet({
      url: nabuUrl,
      endPoint: '/savings/instruments'
    })

  const getInterestLimits = (): { limits: InterestLimitsType } =>
    authorizedGet({
      url: nabuUrl,
      endPoint: '/savings/limits'
    })

  const getInterestTransactions = (): InterestTransactionType =>
    authorizedGet({
      url: nabuUrl,
      endPoint: '/payments/transactions?PRODUCT=savings'
    })
  // const getInterestTransactions = (): InterestTransactionType => ({
  //   amount: '$10000',
  //   id: 'this payment',
  //   insertedAt: 'May 5, 2019',
  //   state: 'COMPLETE',
  //   type: 'DEPOSIT'
  // })

  const getInterestSavingsRate = (): { interestRate: InterestRateType } =>
    authorizedGet({
      url: nabuUrl,
      endPoint: '/savings/rates'
    })

  const getInterestPaymentAccount = (
    ccy: CoinType
  ): InterestPaymentAccountType =>
    authorizedGet({
      url: nabuUrl,
      ignoreQueryParams: true,
      endPoint: `/payments/accounts/savings?ccy=${ccy}`
    })

  return {
    getInterestAccountBalance,
    getInterestEligible,
    getInterestInstruments,
    getInterestLimits,
    getInterestPaymentAccount,
    getInterestSavingsRate,
    getInterestTransactions
  }
}
