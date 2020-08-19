import { CoinType, FiatType } from 'core/types'

export type MoneyType = {
  symbol: FiatType | CoinType
  value: string
}

export type SwapExchangeQuoteType = {
  currencyRatio: {
    base: { crypto: MoneyType; fiat: MoneyType }
    baseToCounterRate: string
    baseToFiatRate: string
    counter: { crypto: MoneyType; fiat: MoneyType }
    counterToBaseRate: string
    counterToFiatRate: string
  }
  fiatCurrency: FiatType
  fix: 'baseInFiat'
  pair: string
  time: string
  volume: string
}
