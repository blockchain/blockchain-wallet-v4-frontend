import { PriceChangeType } from '@core/types'

export type UseCoinPriceArgs = { coin: string }

export type UseCoinPriceResult = PriceChangeType | undefined

export type UseCoinPrice = (args: UseCoinPriceArgs) => UseCoinPriceResult
