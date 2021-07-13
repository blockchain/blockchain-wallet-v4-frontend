import { Exchange } from 'blockchain-wallet-v4/src'
import { CoinType } from 'blockchain-wallet-v4/src/types'
/**
 * If coin='FIAT' this turns minor units like "25 000" cents to a
 * standard unit like "250" dollars. If coin='BTC' or
 * other crypto it converts minor units like "100 000" Sats to a standard unit
 * like "0.001" BTC. If the baseToStandard param is false we do the opposite
 * (dollars -> cents, BTC -> Sats, ect.)
 */
export const convertBaseToStandard = (
  coin: CoinType | 'FIAT',
  value,
  baseToStandard = true
): string => {
  return Exchange.convertCoinToCoin({
    baseToStandard,
    coin,
    value
  }).value
}

/**
 * If coin='FIAT' this turns standard units like "250" dollars to a
 * minor unit like "25 000" cents. If coin='BTC' or
 * other crypto it converts standard units like "0.001" BTC to a minor unit
 * like "100 000" Sats. If the baseToStandard param is true we do the opposite
 * (cents -> dollars, Sats -> Btc, ect.)
 */
export const convertStandardToBase = (
  coin: CoinType | 'FIAT',
  value,
  baseToStandard = false
): string => {
  return Exchange.convertCoinToCoin({
    baseToStandard,
    coin,
    value
  }).value
}
