import { FiatType } from 'core/types'

export type RateType = {
  '15m': number
  buy: number
  last: number
  sell: number
  symbol: string
}

export type RatesType = {
  [key in FiatType]: RateType
}
