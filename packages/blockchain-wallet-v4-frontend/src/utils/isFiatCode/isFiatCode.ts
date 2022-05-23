import { CoinType, FiatCurrencies, FiatType } from '@core/types'

const fiatCodes = Object.values(FiatCurrencies).map((fiatConfig) => fiatConfig.code)

const isFiatCode = (code: FiatType | CoinType): code is FiatType => {
  return fiatCodes.includes(code)
}

export default isFiatCode
