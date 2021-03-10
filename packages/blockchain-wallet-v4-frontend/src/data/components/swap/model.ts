import { CoinType, SwapOrderType } from 'blockchain-wallet-v4/src/types'

export const FALLBACK_DELAY = 10_000 * 2

export const getInput = (order: SwapOrderType) =>
  order.pair.split('-')[0] as CoinType

export const getOutput = (order: SwapOrderType) =>
  order.pair.split('-')[1] as CoinType

export const getInputFromPair = (pair: string) => pair.split('-')[0] as CoinType

export const getOutputFromPair = (pair: string) =>
  pair.split('-')[1] as CoinType
