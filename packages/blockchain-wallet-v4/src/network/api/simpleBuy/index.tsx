import { CurrenciesType } from '../../../types'
import { PairType } from './types'

export default ({ nabuUrl, get }) => {
  const getSBPairs = (
    currency: keyof CurrenciesType
  ): { pairs: Array<PairType> } =>
    get({
      url: nabuUrl,
      endPoint: `/simple-buy/pairs?fiatCurrency=${currency}`
    })

  return {
    getSBPairs
  }
}
