import { Exchange } from 'blockchain-wallet-v4/src'
import { CoinType } from 'blockchain-wallet-v4/src/types'

export const convertBaseToStandard = (
  coin: CoinType | 'FIAT',
  value,
  baseToStandard: boolean = true
): string => {
  return Exchange.convertCoinToCoin({
    coin,
    value,
    baseToStandard
  })
}

export const convertStandardToBase = (
  coin: CoinType | 'FIAT',
  value,
  baseToStandard: boolean = false
): string => {
  return Exchange.convertCoinToCoin({
    coin,
    value,
    baseToStandard
  })
}
