import { CoinType, FiatType } from 'core/types'
import {
  InterestAccountBalanceType,
  InterestEligibleType,
  InterestInstrumentsType,
  InterestLimitsType,
  InterestPaymentAccountType
} from './types'

export default ({ nabuUrl, authorizedGet }) => {
  const getInterestAccountBalance = (
    ccy?: CoinType,
    din?: FiatType
  ): InterestAccountBalanceType =>
    authorizedGet({
      url: nabuUrl,
      ignoreQueryParams: true,
      endpoint: `accounts/savings`,
      data: {
        ccy,
        din
      }
    })

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
    getInterestPaymentAccount
  }
}
