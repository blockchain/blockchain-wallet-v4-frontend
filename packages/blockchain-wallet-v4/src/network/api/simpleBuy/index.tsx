import { CurrenciesType } from '../../../types'
import { FiatEligibleType, PairType } from './types'

export default ({ nabuUrl, get }) => {
  const getSBPairs = (
    currency: keyof CurrenciesType
  ): { pairs: Array<PairType> } =>
    get({
      url: nabuUrl,
      endPoint: `/simple-buy/pairs?fiatCurrency=${currency}`
    })

  const getSBFiatEligible = (
    currency: keyof CurrenciesType
  ): FiatEligibleType =>
    get({
      url: nabuUrl,
      endPoint: `/simple-buy/eligible?fiatCurrency=${currency}`
    })

  return {
    getSBPairs,
    getSBFiatEligible
  }
}
