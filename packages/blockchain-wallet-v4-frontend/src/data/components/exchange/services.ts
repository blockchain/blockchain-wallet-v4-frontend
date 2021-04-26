import { Exchange } from 'blockchain-wallet-v4/src'
import { CoinType } from 'blockchain-wallet-v4/src/types'

export const convertBaseToStandard = (
  coin: CoinType | 'FIAT',
  value,
  baseToStandard = true
): string => {
  return Exchange.convertCoinToCoin({
    coin,
    value,
    baseToStandard
  }).value
}

export const convertStandardToBase = (
  coin: CoinType | 'FIAT',
  value,
  baseToStandard = false
): string => {
  return Exchange.convertCoinToCoin({
    coin,
    value,
    baseToStandard
  }).value
}
