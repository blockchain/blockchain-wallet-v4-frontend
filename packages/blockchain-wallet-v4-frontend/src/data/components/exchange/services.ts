import { Exchange } from 'blockchain-wallet-v4/src'
import { CoinType } from 'blockchain-wallet-v4/src/types'

export const convertBaseToStandard = (
  coin: CoinType | 'FIAT',
  value
): string => {
  return Exchange.convertCoinToCoin({ coin, value, baseToStandard: true }).value
}

export const convertStandardToBase = (
  coin: CoinType | 'FIAT',
  value
): string => {
  return Exchange.convertCoinToCoin({ coin, value, baseToStandard: false })
    .value
}
