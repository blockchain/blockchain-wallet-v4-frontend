import { CoinType, FiatType } from 'core/types'
import {
  InterestAccountBalanceType,
  InterestAccountType,
  InterestEligibleType,
  InterestInstrumentsType,
  InterestLimitsType,
  InterestRateType,
  InterestTransactionResponseType
} from './types'

export default ({ nabuUrl, authorizedGet }) => {
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

  const getInterestLimits = (): { limits: InterestLimitsType } =>
    authorizedGet({
      url: nabuUrl,
      endPoint: '/savings/limits'
    })

  const getInterestTransactions = (): InterestTransactionResponseType => ({
    items: [
      {
        id: '49b1b791-6213-44a9-b3b5-394f594f7a1f',
        amount: {
          symbol: 'BTC',
          value: '1.00'
        },
        state: 'COMPLETE',
        type: 'DEPOSIT',
        extraAttributes: {
          txHash:
            '67e92cbcae1d67313455108ed04eea43deebcbdb82fc14fda1576637a8bbebbd'
        },
        insertedAt: '2020-04-24T18:12:02.334Z'
      },
      {
        id: '81811adf-924a-48ce-be8a-c044f6eb18a7',
        amount: {
          symbol: 'BTC',
          value: '0.20'
        },
        state: 'COMPLETE',
        type: 'WITHDRAWAL',
        extraAttributes: {
          txHash:
            '67e92cbcae1d67313455108ed04eea43deebcbdb82fc14fda1576637a8bbebbd'
        },
        insertedAt: '2020-04-24T18:12:02.334Z'
      },
      {
        id: '5c79a5a1-bed5-4353-97e1-35c8c936daf6',
        amount: {
          symbol: 'BTC',
          value: '0.000002'
        },
        state: 'COMPLETE',
        type: 'INTEREST_OUTGOING',
        extraAttributes: {
          txHash:
            '67e92cbcae1d67313455108ed04eea43deebcbdb82fc14fda1576637a8bbebbd'
        },
        insertedAt: '2020-04-24T18:12:02.334Z'
      }
    ]
  })
  // authorizedGet({
  //   url: nabuUrl,
  //   endPoint: '/payments/transactions?PRODUCT=savings&'
  // })

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

  return {
    getInterestAccountBalance,
    getInterestEligible,
    getInterestInstruments,
    getInterestLimits,
    getInterestAccount,
    getInterestSavingsRate,
    getInterestTransactions
  }
}
