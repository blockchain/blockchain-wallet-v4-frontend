import { CoinType, OfferType } from 'core/types'
import { Exchange } from 'blockchain-wallet-v4/src'

export const INVALID_COIN_TYPE = 'Invalid coin type'

export const NO_OFFER_EXISTS = 'NO_OFFER_EXISTS'

export const getCollateralizationColor = (
  displayName: 'safe' | 'risky' | 'unsafe'
) => {
  switch (displayName) {
    case 'safe':
      return 'green600'
    case 'risky':
      return 'orange600'
    case 'unsafe':
      return 'red600'
  }
}

export const getCollateralizationDisplayName = (
  currentCollateral: number,
  offer: OfferType
) => {
  switch (true) {
    case currentCollateral >= offer.terms.collateralRatio:
      return 'safe'
    case currentCollateral >= offer.callTerms.callTriggerRatio:
      return 'risky'
    default:
      return 'unsafe'
  }
}

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
