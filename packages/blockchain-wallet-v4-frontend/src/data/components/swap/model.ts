import { CoinType, SwapOrderType } from 'core/types'

export const getInput = (order: SwapOrderType) =>
  order.pair.split('-')[0] as CoinType

export const getOutput = (order: SwapOrderType) =>
  order.pair.split('-')[1] as CoinType
