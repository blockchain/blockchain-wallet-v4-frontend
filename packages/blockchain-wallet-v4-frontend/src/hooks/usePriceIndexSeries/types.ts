import { RemoteHookState } from '../useRemote'

export type PriceIndexSeriesData = {
  price: number
  timestamp: number
  volume24h: number
}[]

export type PriceIndexSeriesHook = () => RemoteHookState<Error, PriceIndexSeriesData>
