import { CurrenciesType } from '../../../types'
import { FiatEligibleType, SBPairType } from './types'

export default ({ nabuUrl, get }) => {
  const getSBPairs = (
    currency: keyof CurrenciesType
  ): { pairs: Array<SBPairType> } =>
    get({
      url: nabuUrl,
      endPoint: '/simple-buy/pairs',
      data: {
        fiatCurrency: currency
      }
    })

  const getSBFiatEligible = (
    currency: keyof CurrenciesType
  ): FiatEligibleType =>
    get({
      url: nabuUrl,
      endPoint: '/simple-buy/eligible',
      data: {
        fiatCurrency: currency
      }
    })

  const getSBSuggestedAmounts = (currency: keyof CurrenciesType) =>
    get({
      url: nabuUrl,
      endPoint: '/simple-buy/amounts',
      data: {
        currency
      }
    })

  return {
    getSBPairs,
    getSBFiatEligible,
    getSBSuggestedAmounts
  }
}
