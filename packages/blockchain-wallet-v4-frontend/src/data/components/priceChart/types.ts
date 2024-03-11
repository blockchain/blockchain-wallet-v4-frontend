import { CoinType, TimeRange } from '@core/types'

export type CoinPayload = {
  coin: CoinType
}

export type TimePayload = {
  time: TimeRange
}

export type PriceChartType = CoinPayload & TimePayload
