import { CoinType } from 'core/types'
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
  // const getInterestAccountBalance = (
  //   ccy?: CoinType,
  //   din?: FiatType
  // ): InterestAccountBalanceType =>
  //   authorizedGet({
  //     url: nabuUrl,
  //     ignoreQueryParams: true,
  //     endpoint: '/accounts/savings',
  //     data: {
  //       ccy,
  //       din
  //     }
  //   })

  const getInterestAccountBalance = (): InterestAccountBalanceType => ({
    BTC: {
      balanceAvailable: 1003414134,
      pendingInterest: 300,
      totalInterest: 900,
      pendingWithdrawal: 500000,
      pendingDeposit: 4000,
      fiatAmount: 1234323,
      fiatCurrency: 'EUR'
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

  const getInterestTransactions = (): InterestTransactionType =>
    authorizedGet({
      url: nabuUrl,
      endPoint: '/payments/transactions?PRODUCT=savings'
    })

  // const getInterestSavingsRate = (): { interestRate: InterestRateType } =>
  //   authorizedGet({
  //     url: nabuUrl,
  //     endPoint: '/savings/rates'
  //   })

  const getInterestSavingsRate = (): { interestRate: InterestRateType } => ({
    interestRate: { BTC: 3.2 }
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
