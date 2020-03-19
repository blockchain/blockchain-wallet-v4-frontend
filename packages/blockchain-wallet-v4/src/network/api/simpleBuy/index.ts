import { CryptoCurrenciesType, CurrenciesType } from '../../../types'
import {
  FiatEligibleType,
  SBMoneyType,
  SBOrderType,
  SBPairsType,
  SBPairType
} from './types'

export default ({
  nabuUrl,
  get,
  authorizedGet,
  authorizedPost,
  authorizedPut
}) => {
  const createSBOrder = (
    pair: SBPairsType,
    action: 'BUY' | 'SELL',
    input: SBMoneyType,
    output: {
      symbol: keyof CryptoCurrenciesType
    }
  ): SBOrderType =>
    authorizedPost({
      url: nabuUrl,
      endPoint: '/simple-buy/trades',
      contentType: 'application/json',
      data: {
        pair,
        action,
        input,
        output
      }
    })

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
    authorizedGet({
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
    createSBOrder,
    getSBPairs,
    getSBFiatEligible,
    getSBSuggestedAmounts
  }
}
