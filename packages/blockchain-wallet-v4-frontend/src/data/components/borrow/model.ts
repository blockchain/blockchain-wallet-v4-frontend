import { CoinType } from 'core/types'
import { Exchange } from 'blockchain-wallet-v4/src'

export const INVALID_COIN_TYPE = 'Invalid coin type'

export const NO_OFFER_EXISTS = 'NO_OFFER_EXISTS'

export const fiatDisplayName = (coin: CoinType) => {
  switch (coin) {
    case 'PAX':
      return 'USD'
    default:
      return 'USD'
  }
}

export const getAmount = (value: number, coin: CoinType) => {
  switch (coin) {
    case 'BTC':
      return Exchange.convertBtcToBtc({ value, fromUnit: 'BTC', toUnit: 'SAT' })
  }
}
