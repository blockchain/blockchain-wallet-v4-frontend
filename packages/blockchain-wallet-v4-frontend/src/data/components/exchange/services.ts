import { Exchange } from 'blockchain-wallet-v4/src'

export const convertBaseToStandard = (coin: string, value, baseToStandard = true): string => {
  return Exchange.convertCoinToCoin({
    baseToStandard,
    coin,
    value,
  })
}

export const convertStandardToBase = (coin: string, value, baseToStandard = false): string => {
  return Exchange.convertCoinToCoin({
    baseToStandard,
    coin,
    value,
  })
}
